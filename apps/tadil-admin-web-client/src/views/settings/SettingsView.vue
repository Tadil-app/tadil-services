<template>
  <section class="mx-auto w-full max-w-6xl space-y-6">
    <header class="flex min-w-0 items-start gap-3">
      <span class="mt-1 rounded-2xl bg-primary/10 p-3 text-primary" aria-hidden="true">
        <Settings class="h-6 w-6" />
      </span>
      <div class="min-w-0">
        <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {{ $t('platformSettings.title') }}
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
          {{ $t('platformSettings.subtitle') }}
        </p>
      </div>
    </header>

    <form
      class="max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      :aria-busy="loading"
      @submit.prevent="submit"
    >
      <div class="space-y-5">
        <p
          v-if="message"
          class="rounded-lg px-3 py-2 text-sm"
          :class="saved ? 'bg-green-600/10 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'"
          role="status"
          aria-live="polite"
        >
          {{ $t(message) }}
        </p>

        <label v-for="field in fields" :key="field.key" class="form-label" :for="field.key">
          {{ $t(`platformSettings.${field.key}.label`) }}
          <input
            :id="field.key"
            v-model.number="form[field.key]"
            class="form-input"
            type="number"
            inputmode="decimal"
            min="0"
            :max="field.percent ? 100 : undefined"
            step="0.01"
            required
            :disabled="!canEdit || loading"
          />
          <span class="text-xs font-normal text-muted-foreground">
            {{ $t(`platformSettings.${field.key}.hint`) }}
          </span>
        </label>

        <p class="rounded-lg bg-muted px-3 py-2 text-sm">
          {{ $t('platformSettings.example', { total: EXAMPLE_TOTAL, fee: exampleFee }) }}
        </p>

        <div v-if="canEdit" class="flex justify-end border-t border-border pt-5">
          <button
            class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            :disabled="loading"
          >
            {{ loading ? $t('platformSettings.saving') : $t('platformSettings.save') }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Settings } from 'lucide-vue-next';
import { authHttp, can } from '@/auth';

type Key =
  | 'freeDeliveryThreshold'
  | 'courierBasePayout'
  | 'tailorCommissionRate'
  | 'courierCommissionRate';

const fields: { key: Key; percent?: boolean }[] = [
  { key: 'freeDeliveryThreshold' },
  { key: 'courierBasePayout' },
  { key: 'tailorCommissionRate', percent: true },
  { key: 'courierCommissionRate', percent: true },
];

const EXAMPLE_TOTAL = 100;
const canEdit = can('settings.update');
const form = reactive<Record<Key, number>>({
  freeDeliveryThreshold: 0,
  courierBasePayout: 0,
  tailorCommissionRate: 0,
  courierCommissionRate: 0,
});
const loading = ref(false);
const saved = ref(false);
const message = ref('');

// Display only: the API computes the real fee (platformSettings.model.ts).
const exampleFee = computed(() => {
  if (form.freeDeliveryThreshold > 0 && EXAMPLE_TOTAL >= form.freeDeliveryThreshold) return 0;
  const fee =
    form.courierBasePayout * 2 - (EXAMPLE_TOTAL * form.courierCommissionRate * 2) / 100;
  return Math.max(0, Math.round(fee * 100) / 100);
});

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await authHttp.get('/api/settings');
    for (const { key } of fields) form[key] = data[key];
  } catch {
    message.value = 'platformSettings.loadFailed';
  } finally {
    loading.value = false;
  }
});

const submit = async () => {
  saved.value = false;
  const valid = fields.every(({ key, percent }) => {
    const v = form[key];
    return typeof v === 'number' && Number.isFinite(v) && v >= 0 && (!percent || v <= 100);
  });
  if (!valid) {
    message.value = 'platformSettings.invalid';
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    await authHttp.put('/api/settings', { ...form });
    saved.value = true;
    message.value = 'platformSettings.saved';
  } catch {
    message.value = 'platformSettings.saveFailed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-label {
  display: grid;
  min-width: 0;
  gap: 0.5rem;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  font-weight: 600;
}
.form-input {
  min-width: 0;
  width: 100%;
  border: 1px solid hsl(var(--input));
  border-radius: 0.5rem;
  background: hsl(var(--background));
  padding: 0.7rem 0.8rem;
  font: inherit;
  font-weight: 400;
  outline: none;
}
.form-input:focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}
.form-input:disabled {
  opacity: 0.7;
}
</style>
