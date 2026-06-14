<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="modal-panel relative max-w-[80vw] max-h-[85vh] overflow-auto rounded-xl border border-border bg-card text-card-foreground shadow-2xl"
          :class="$attrs.class"
        >
          <button
            type="button"
            class="absolute end-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :aria-label="$t('common.buttons.close')"
            @click="closeModal"
          >
            <X class="h-4 w-4" />
          </button>
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue";
import { X } from "lucide-vue-next";

const isOpen = defineModel<boolean>();
const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

function closeModal() {
  emit("closeModal");
  isOpen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeModal();
}

// Lock body scroll and bind Esc only while the modal is open.
watch(
  isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeydown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeydown);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
