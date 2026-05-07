<template>
  <div class="grid grid-cols-2 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 dark:border-white/10 shadow-sm transition-transform active:scale-95 text-white"
    >
      <p class="text-3xl font-black mb-1">{{ stat.count }}</p>
      <p class="text-xs font-medium uppercase opacity-90 leading-tight">
        {{ $t(`orderStatus.${stat.label}`) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ORDER_STATUS } from "@/integration/dtos";

const props = defineProps<{
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  waitingForPickupCount: number;
}>();

const stats = computed(() => [
  { label: ORDER_STATUS.IN_PROGRESS, count: props.inProgressCount },
  { label: ORDER_STATUS.PENDING, count: props.pendingCount },
  { label: ORDER_STATUS.COMPLETED, count: props.completedCount },
  { label: ORDER_STATUS.WAITING_FOR_PICKUP, count: props.waitingForPickupCount },
]);
</script>
