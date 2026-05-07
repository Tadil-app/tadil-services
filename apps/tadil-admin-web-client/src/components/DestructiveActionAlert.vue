<template>
  <div>
    <slot name="trigger" :openAlert="openAlert" />
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/40 h-full w-full flex items-center justify-center"
    >
      <div
        class="relative p-6 mx-auto my-auto max-w-[80vw] max-h-[80vh] bg-background rounded-lg"
      >
        <div
          class="absolute right-1 top-1 cursor-pointer rounded-sm p-1 text-sm flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 bg-accent text-muted-foreground"
          @click="closeAlert"
        >
          <X class="h-4 w-4" />
        </div>
        <div>
          <p class="text-lg font-semibold">{{ title }}</p>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
        <div class="flex justify-end items-center gap-2 mt-4">
          <Button @click="confirm" variant="destructive">
            {{ confirmText ?? $t("common.buttons.confirm") }}
          </Button>
          <Button @click="cancel" variant="outline">
            {{ cancelText ?? $t("common.buttons.cancel") }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { X } from "lucide-vue-next";
import Button from "./ui/Button.vue";

const emit = defineEmits<{
  (e: "confirmed"): void;
  (e: "cancelled"): void;
}>();
const props = defineProps<{
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}>();

const isOpen = ref<boolean>(false);

function openAlert() {
  isOpen.value = true;
}

function closeAlert() {
  isOpen.value = false;
}

function confirm() {
  if (props.onConfirm) props.onConfirm();
  emit("confirmed");
  closeAlert();
}

function cancel() {
  if (props.onCancel) props.onCancel();
  emit("cancelled");
  closeAlert();
}
</script>
