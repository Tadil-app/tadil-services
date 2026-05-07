<template>
  <div
    v-if="isOpen"
    class="fixed top-10 z-100 flex w-full flex-col-reverse right-10 max-w-[420px]"
    @mouseenter="pauseToast"
    @mouseleave="resumeToast"
  >
    <div
      class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-6 pr-8 shadow-lg transition-all"
      :class="{
        'border bg-background text-foreground': toastVariant === 'default',
        'destructive group border-destructive bg-destructive text-destructive-foreground':
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
      <div
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
        @click="closeToast"
      >
        <X class="h-4 w-4" />
      </div>
    </div>
  </div>
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
