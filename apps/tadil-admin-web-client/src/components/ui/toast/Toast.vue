<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="isOpen"
        class="fixed top-6 z-[100] flex w-full flex-col-reverse end-6 max-w-[420px]"
        @mouseenter="pauseToast"
        @mouseleave="resumeToast"
      >
        <div
          class="group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg p-5 pe-9 shadow-lg ring-1 ring-black/5"
          :class="{
            'border border-border bg-popover text-popover-foreground':
              toastVariant === 'default',
            'destructive group border border-destructive bg-destructive text-destructive-foreground':
              toastVariant === 'destructive',
          }"
        >
      <div class="grid gap-1">
        <p class="text-sm font-semibold">{{ toastTitle }}</p>
        <p
          class="text-sm"
          :class="{ 'opacity-90': toastVariant === 'default' }"
        >
          {{ toastDescription }}
        </p>
        <button
          v-if="toastDetails"
          class="text-sm underline"
          @click="isToastDetailsOpen = !isToastDetailsOpen"
        >
          {{
            isToastDetailsOpen
              ? $t("toast.hideDetails")
              : $t("toast.showDetails")
          }}
        </button>
        <div v-if="isToastDetailsOpen">
          <ul v-if="Array.isArray(toastDetails)">
            <li v-for="detail in toastDetails" class="text-sm">{{ detail }}</li>
          </ul>
          <p v-else class="text-sm">{{ toastDetails }}</p>
        </div>
      </div>
          <button
            class="absolute end-2 top-2 rounded-md p-1 text-current/60 opacity-0 transition-opacity hover:text-current focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100"
            @click="closeToast"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import useToast from "./useToast.composable";

const {
  isOpen,
  toastVariant,
  toastTitle,
  toastDescription,
  toastDetails,
  isToastDetailsOpen,
  closeToast,
  pauseToast,
  resumeToast,
} = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}
</style>
