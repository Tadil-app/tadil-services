<template>
  <Button
    variant="outline"
    size="sm"
    :aria-label="$t('common.inputs.sorting.label')"
    :title="$t('common.inputs.sorting.label')"
    @click="open"
  >
    <ArrowUpDown class="h-4 w-4" />
  </Button>
  <Modal v-model="isOpen" @close-modal="isOpen = false">
    <div class="w-80 max-w-full space-y-4">
      <h1 class="text-xl font-bold">{{ $t("common.inputs.sorting.label") }}</h1>
      <TextInput
        v-model="value"
        type="number"
        :min="1"
        :max="max"
        :placeholder="$t('common.inputs.sorting.placeholder')"
        :validation-error-message="error"
      />
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="isOpen = false">
          {{ $t("common.buttons.cancel") }}
        </Button>
        <Button :disabled="isSaving" @click="submit">
          {{ $t("common.buttons.save") }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ArrowUpDown } from "lucide-vue-next";
import { Button, Modal, TextInput, useToast } from "@/components";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  sorting: number;
  max: number;
  save: (sorting: number) => Promise<void>;
}>();
const { t } = useI18n();
const { openToast } = useToast();
const isOpen = ref(false);
const isSaving = ref(false);
const value = ref<number | string>(props.sorting);
const error = ref("");

function open() {
  value.value = props.sorting;
  error.value = "";
  isOpen.value = true;
}

async function submit() {
  const sorting = Number(value.value);
  if (!Number.isInteger(sorting) || sorting < 1 || sorting > props.max) {
    error.value = t("common.inputs.sorting.errorMessage", { max: props.max });
    return;
  }
  isSaving.value = true;
  try {
    await props.save(sorting);
    isOpen.value = false;
  } catch (err: any) {
    openToast(
      t("common.inputs.sorting.saveError"),
      err?.response?.data?.message || undefined,
      undefined,
      "destructive"
    );
  } finally {
    isSaving.value = false;
  }
}
</script>
