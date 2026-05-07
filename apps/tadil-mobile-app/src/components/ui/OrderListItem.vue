<template>
  <div
    class="flex items-center justify-between p-4 rounded-2xl bg-item text-main border border-border shadow-sm active:bg-step-100 transition-colors cursor-pointer"
  >
    <div class="flex items-center gap-4 min-w-0">
      <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Package class="text-primary w-6 h-6" />
      </div>
      <div class="min-w-0">
        <p class="font-bold text-lg truncate">#{{ reference }}</p>
        <p class="text-xs text-medium">{{ formatDate(date) }}</p>
      </div>
    </div>
    <div class="flex flex-col items-end gap-1 shrink-0 ms-4">
      <p class="font-black text-tertiary">
        {{ totalPrice }} {{ $t("common.currencies.sar") }}
      </p>
      <StatusPill :status="status" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package } from "lucide-vue-next";
import { formatDate } from "@/utils";
import StatusPill from "./StatusPill.vue";

defineProps<{
  reference: string;
  date: string;
  totalPrice: number;
  status: string;
}>();
</script>
