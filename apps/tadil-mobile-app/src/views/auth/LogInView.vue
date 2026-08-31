<template>
  <IonPage>
    <IonContent class="ion-padding">
      <div class="login-page">
        <IonCard color="light" class="login-card">
          <div class="login-logo">
            <img src="/Tadil_logo.svg" alt="Tadil-تعديل" />
          </div>

          <!-- Step 1: Phone Input -->
          <div v-if="loginStep === 'phone'" class="login-form">
            <div class="login-field">
              <label>{{ $t("login.form.phoneNumber.label") }}</label>
              <div class="phone-input-shell">
                <span class="phone-input-icon" aria-hidden="true">
                  <IonIcon :icon="callOutline" />
                </span>
                <IonInput v-model="phoneNumber" type="tel" inputmode="tel" dir="ltr" class="phone-input" :placeholder="$t('login.form.phoneNumber.placeholder')" :minlength="10" :maxlength="10" :required="true" enterkeyhint="send" :error-text="phoneNumberErrorMessage" />
              </div>
              <p v-if="phoneNumberErrorMessage" class="text-sm text-danger">
                {{ phoneNumberErrorMessage }}
              </p>
            </div>

            <IonButton expand="block" color="primary" type="submit" class="login-button" @click="onLogin" :disabled="isLoading">
              <IonSpinner v-if="isLoading" name="crescent" />
              <span v-else>{{ $t("login.form.buttons.login") }}</span>
            </IonButton>
            <p class="login-agreement">{{ $t("login.form.agreement") }}</p>
          </div>

          <!-- Step 2: Signup Form (Complete Profile) -->
          <div v-if="loginStep === 'signup'" class="px-10 space-y-5">
            <h2 class="text-center font-bold">
              {{ $t("login.form.signup.title") }}
            </h2>
            <IonInput v-model="firstName" :label="$t('login.form.signup.firstName.label')" label-placement="floating" fill="solid" :placeholder="$t('login.form.signup.firstName.placeholder')" required />
            <IonInput v-model="lastName" :label="$t('login.form.signup.lastName.label')" label-placement="floating" fill="solid" :placeholder="$t('login.form.signup.lastName.placeholder')" required />

            <div class="pt-5 space-y-3">
              <IonButton expand="block" color="primary" class="w-full" @click="onCompleteProfile" :disabled="isLoading">
                <IonSpinner v-if="isLoading" name="crescent" />
                <span v-else>{{ $t("login.form.buttons.signup") }}</span>
              </IonButton>
              <IonButton expand="block" fill="clear" class="w-full" @click="loginStep = 'phone'">
                {{ $t("login.form.buttons.back") }}
              </IonButton>
            </div>
          </div>

          <!-- Status Displays -->
          <div v-if="loginStep === 'pending'" class="px-10 text-center space-y-5">
            <IonIcon :icon="timeOutline" class="text-6xl text-warning" />
            <p>{{ statusMessage || $t("login.form.status.pending") }}</p>
            <IonButton expand="block" fill="clear" @click="loginStep = 'phone'">
              {{ $t("login.form.buttons.back") }}
            </IonButton>
          </div>

          <div v-if="loginStep === 'rejected'" class="px-10 text-center space-y-5">
            <IonIcon :icon="closeCircleOutline" class="text-6xl text-danger" />
            <p>{{ statusMessage || $t("login.form.status.rejected") }}</p>
            <IonButton expand="block" fill="clear" @click="loginStep = 'phone'">
              {{ $t("login.form.buttons.back") }}
            </IonButton>
          </div>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { IonButton, IonCard, IonContent, IonInput, IonPage, IonSpinner, IonIcon, onIonViewWillEnter } from "@ionic/vue";
import { callOutline, timeOutline, closeCircleOutline } from "ionicons/icons";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const loginStep = ref<"phone" | "signup" | "pending" | "rejected">("phone");
const isLoading = ref(false);
const statusMessage = ref("");

const phoneNumber = ref<string>("");
const phoneNumberErrorMessage = ref<string>("");

const firstName = ref("");
const lastName = ref("");

// Ionic keeps this page cached in the router outlet stack, so its local state
// survives a logout that navigates back here. Reset to the phone step on each
// entry, otherwise a user who just signed up would re-enter on the signup form.
onIonViewWillEnter(() => {
  loginStep.value = "phone";
  statusMessage.value = "";
  firstName.value = "";
  lastName.value = "";
  phoneNumberErrorMessage.value = "";
});

function validatePhoneNumber() {
  if (!phoneNumber.value) {
    phoneNumberErrorMessage.value = t("login.form.phoneNumber.undefinedErrorMessage");
    return false;
  }
  if (isNaN(Number(phoneNumber.value))) {
    phoneNumberErrorMessage.value = t("login.form.phoneNumber.numericErrorMessage");
    return false;
  }
  if (phoneNumber.value.length < 10) {
    phoneNumberErrorMessage.value = t("login.form.phoneNumber.lengthErrorMessage");
    return false;
  }

  phoneNumberErrorMessage.value = "";
  return true;
}

async function onLogin() {
  if (!validatePhoneNumber()) return;

  isLoading.value = true;
  try {
    const response = await authStore.login(phoneNumber.value);

    if (response.status === "authenticated") {
      handleNavigation(response.user?.role);
    } else if (response.status === "signup_required") {
      loginStep.value = "signup";
    } else if (response.status === "pending") {
      statusMessage.value = response.message || "";
      loginStep.value = "pending";
    } else if (response.status === "rejected") {
      statusMessage.value = response.message || "";
      loginStep.value = "rejected";
    }
  } catch (error) {
    console.error("Login error", error);
  } finally {
    isLoading.value = false;
  }
}

async function onCompleteProfile() {
  if (!firstName.value || !lastName.value) return;

  isLoading.value = true;
  try {
    const response = await authStore.completeProfile(phoneNumber.value, firstName.value, lastName.value);
    if (response.status === "authenticated") {
      handleNavigation(response.user?.role);
    }
  } catch (error) {
    console.error("Complete profile error", error);
  } finally {
    isLoading.value = false;
  }
}

function handleNavigation(role?: string) {
  const redirectPath = route.query.redirect as string;
  if (redirectPath) {
    router.push(redirectPath);
    return;
  }

  if (role === "tailor") {
    router.push({ name: "tailor-dashboard" });
  } else if (role === "courier") {
    router.push({ name: "courier-dashboard" });
  } else {
    router.push({ name: "customer-dashboard" });
  }
}
</script>

<style scoped>
ion-content {
  --background: radial-gradient(ellipse at 18% 16%, rgba(200, 112, 130, 0.16), transparent 34%), radial-gradient(ellipse at 84% 78%, rgba(199, 123, 88, 0.12), transparent 32%), linear-gradient(135deg, #fffdf9 0%, #fff6f3 48%, #fffaf6 100%);
}

.login-page {
  display: grid;
  min-height: 100%;
  place-items: center;
  padding: 28px 8px;
}

.login-card {
  width: min(100%, 430px);
  margin: 0;
  padding: 24px 24px 32px;
  border: 1px solid rgba(109, 15, 47, 0.22);
  border-radius: 24px;
  box-shadow: 0 16px 38px rgba(109, 15, 47, 0.14);
}

.login-logo {
  display: grid;
  place-items: center;
  min-height: 250px;
}

.login-logo img {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.login-form {
  display: grid;
  gap: 24px;
}

.login-field {
  display: grid;
  gap: 10px;
}

.login-field label {
  color: var(--ion-text-color);
  font-size: 17px;
  font-weight: 600;
}

.phone-input-shell {
  display: grid;
  direction: ltr;
  grid-template-columns: 70px minmax(0, 1fr);
  overflow: hidden;
  min-height: 58px;
  border: 1px solid #c9939f;
  border-radius: 12px;
  background: rgba(255, 253, 251, 0.82);
}

.phone-input-shell:focus-within {
  border-color: var(--ion-color-primary);
}

.phone-input-icon {
  display: grid;
  border-right: 1px solid #dfb7c0;
  place-items: center;
  color: var(--ion-color-secondary);
}

.phone-input-icon ion-icon {
  font-size: 25px;
}

.phone-input {
  --background: transparent;
  --border-width: 0;
  --highlight-height: 0;
  --padding-start: 16px;
  --padding-end: 16px;
  min-height: 58px;
  text-align: center;
}

.login-button {
  --border-radius: 12px;
  min-height: 58px;
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.login-agreement {
  color: var(--ion-step-400);
  font-size: 13px;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-height: 720px) {
  .login-page {
    padding-block: 12px;
  }

  .login-logo {
    min-height: 190px;
  }

  .login-logo img {
    width: 176px;
    height: 176px;
  }
}
</style>
