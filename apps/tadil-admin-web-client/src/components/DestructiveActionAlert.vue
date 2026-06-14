<template>
  <div>
    <slot name="trigger" :openAlert="openAlert" />
    <Teleport to="body">
      <Transition name="alert">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="cancel"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            class="alert-panel relative w-full max-w-md rounded-xl border border-border bg-card text-card-foreground p-6 shadow-2xl"
          >
            <div class="flex gap-4">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
              >
                <TriangleAlert class="h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-base font-semibold">{{ title }}</p>
                <p v-if="description" class="mt-1 text-sm text-muted-foreground">
                  {{ description }}
                </p>
              </div>
            </div>
            <div class="mt-6 flex justify-end items-center gap-2">
              <Button @click="cancel" variant="outline">
                {{ cancelText ?? $t("common.buttons.cancel") }}
              </Button>
              <Button @click="confirm" variant="destructive">
                {{ confirmText ?? $t("common.buttons.confirm") }}
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { TriangleAlert } from "lucide-vue-next";
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") cancel();
}

watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeydown);
  } else {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.18s ease;
}
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
}
.alert-enter-active .alert-panel,
.alert-leave-active .alert-panel {
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.alert-enter-from .alert-panel,
.alert-leave-to .alert-panel {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
