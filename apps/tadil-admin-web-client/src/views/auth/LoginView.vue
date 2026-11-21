<template>
  <AuthShell branded>
    <form
      class="auth-card"
      aria-labelledby="login-title"
      :aria-busy="loading"
      @submit.prevent="submit"
    >
      <div class="auth-card-heading">
        <span class="auth-eyebrow">{{ $t('auth.brand') }}</span>
        <h1 id="login-title">
          {{ $t(step === 'credentials' ? 'auth.signIn' : 'auth.mfaTitle') }}
        </h1>
        <p>
          {{
            $t(step === 'credentials' ? 'auth.signInHint' : 'auth.mfaHint', {
              email: maskedEmail,
            })
          }}
        </p>
      </div>
      <p v-if="error" id="login-error" class="auth-alert" role="alert">
        {{ $t(error) }}
      </p>
      <template v-if="step === 'credentials'">
        <label class="auth-label" for="login-email"
          >{{ $t('auth.email')
          }}<input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="username"
            autocapitalize="none"
            spellcheck="false"
            :aria-invalid="!!error"
            :aria-describedby="error ? 'login-error' : undefined"
            required
        /></label>
        <label class="auth-label" for="login-password"
          >{{ $t('auth.password') }}
          <div class="auth-password">
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :aria-invalid="!!error"
              :aria-describedby="error ? 'login-error' : undefined"
              required
            /><button
              type="button"
              class="auth-icon-button"
              :aria-label="
                $t(showPassword ? 'auth.hidePassword' : 'auth.showPassword')
              "
              :aria-pressed="showPassword"
              aria-controls="login-password"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="20" aria-hidden="true" />
              <Eye v-else :size="20" aria-hidden="true" />
            </button></div
        ></label>
        <button class="auth-primary" type="submit" :disabled="loading">
          {{ loading ? $t('auth.signingIn') : $t('auth.signInButton') }}
        </button>
      </template>
      <template v-else>
        <label class="auth-label" for="login-otp"
          >{{ $t('auth.mfaCode')
          }}<input
            id="login-otp"
            v-model="code"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            autocomplete="one-time-code"
            autocapitalize="none"
            spellcheck="false"
            :aria-invalid="!!error"
            :aria-describedby="error ? 'login-error' : undefined"
            required
        /></label>
        <button class="auth-primary" type="submit" :disabled="loading">
          {{ loading ? $t('auth.mfaVerifying') : $t('auth.mfaVerify') }}
        </button>
        <div class="auth-mfa-actions">
          <button
            type="button"
            class="auth-link"
            :disabled="loading || resendCooldown > 0"
            @click="resend"
          >
            {{
              resendCooldown > 0
                ? $t('auth.mfaResendWait', { seconds: resendCooldown })
                : $t('auth.mfaResend')
            }}
          </button>
          <button type="button" class="auth-link" :disabled="loading" @click="back">
            {{ $t('auth.mfaBack') }}
          </button>
        </div>
      </template>
    </form>
  </AuthShell>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Eye, EyeOff } from 'lucide-vue-next';
import { login, resendMfa, verifyMfa } from '@/auth';
import AuthShell from './AuthShell.vue';
const email = ref('');
const password = ref('');
const code = ref('');
const mfaToken = ref('');
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);
const step = ref<'credentials' | 'mfa'>('credentials');
const resendCooldown = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | undefined;
const router = useRouter();
const route = useRoute();
const maskedEmail = computed(() => {
  const value = email.value.trim();
  const at = value.indexOf('@');
  if (at <= 1) return value;
  return `${value[0]}•••${value.slice(at)}`;
});
const returnTarget = () =>
  typeof route.query.returnUrl === 'string' &&
  route.query.returnUrl.startsWith('/') &&
  !route.query.returnUrl.startsWith('//') &&
  !route.query.returnUrl.includes('\\') &&
  route.query.returnUrl !== '/no-access'
    ? route.query.returnUrl
    : '/';
const startCooldown = (seconds = 60) => {
  resendCooldown.value = seconds;
  clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    resendCooldown.value -= 1;
    if (resendCooldown.value <= 0) clearInterval(cooldownTimer);
  }, 1000);
};
const back = () => {
  step.value = 'credentials';
  code.value = '';
  mfaToken.value = '';
  error.value = '';
  resendCooldown.value = 0;
  clearInterval(cooldownTimer);
};
const submit = async () => {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    if (step.value === 'credentials') {
      const result = await login(email.value, password.value);
      if ('mfaRequired' in result && result.mfaRequired) {
        mfaToken.value = result.mfaToken;
        step.value = 'mfa';
        code.value = '';
        startCooldown();
        return;
      }
      await router.replace(returnTarget());
      return;
    }
    await verifyMfa(mfaToken.value, code.value.trim());
    await router.replace(returnTarget());
  } catch {
    error.value =
      step.value === 'credentials'
        ? 'auth.invalidCredentials'
        : 'auth.mfaInvalid';
  } finally {
    loading.value = false;
  }
};
const resend = async () => {
  if (loading.value || resendCooldown.value > 0 || !mfaToken.value) return;
  loading.value = true;
  error.value = '';
  try {
    const result = await resendMfa(mfaToken.value);
    mfaToken.value = result.mfaToken;
    startCooldown();
  } catch {
    error.value = 'auth.mfaResendFailed';
  } finally {
    loading.value = false;
  }
};
onBeforeUnmount(() => clearInterval(cooldownTimer));
</script>
<style scoped>
.auth-card {
  width: min(100%, 440px);
  display: grid;
  gap: 20px;
  border: 1px solid hsl(var(--border));
  border-radius: 20px;
  background: hsl(var(--background) / 0.94);
  padding: clamp(24px, 5vw, 40px);
  box-shadow: 0 24px 70px -35px hsl(var(--primary) / 0.45);
}
.auth-card-heading {
  display: grid;
  gap: 8px;
}
.auth-card-heading h1 {
  font-size: clamp(1.6rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.025em;
}
.auth-card-heading p {
  color: hsl(var(--muted-foreground));
  font-size: 0.95rem;
}
.auth-eyebrow {
  color: hsl(var(--primary));
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.auth-label {
  display: grid;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
}
.auth-label input {
  min-width: 0;
  width: 100%;
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  background: hsl(var(--background));
  padding: 12px 14px;
  font: inherit;
  outline: none;
}
.auth-label input:focus {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
}
.auth-password {
  position: relative;
}
.auth-password input {
  padding-inline-end: 44px;
}
.auth-icon-button {
  display: grid;
  place-items: center;
  position: absolute;
  inset-inline-end: 8px;
  top: 7px;
  width: 34px;
  height: 34px;
  color: hsl(var(--muted-foreground));
}
.auth-primary {
  border-radius: 10px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 13px;
  font-weight: 700;
  transition: opacity 0.2s;
}
.auth-primary:disabled {
  opacity: 0.6;
  cursor: wait;
}
.auth-alert {
  border-radius: 9px;
  background: hsl(var(--destructive) / 0.1);
  color: hsl(var(--destructive));
  padding: 10px 12px;
  font-size: 0.875rem;
}
.auth-mfa-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  justify-content: space-between;
}
.auth-link {
  color: hsl(var(--primary));
  font-size: 0.875rem;
  font-weight: 600;
  background: transparent;
  padding: 0;
}
.auth-link:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
