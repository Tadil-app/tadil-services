<template>
  <div
    class="px-2 py-1 text-[10px] font-bold rounded-full w-fit uppercase tracking-wider"
    :class="statusClasses"
  >
    {{ $t(`orderStatus.${status}`) }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ORDER_STATUS } from "@/integration/dtos";

const props = defineProps<{
  status: string;
}>();

const statusClasses = computed(() => {
  switch (props.status) {
    case ORDER_STATUS.DONE:
      return "text-green-700 bg-green-500/20 dark:text-green-400 dark:bg-green-500/10 border border-green-500/30";
    case ORDER_STATUS.PENDING:
      return "text-amber-700 bg-amber-500/20 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-500/30";
    case ORDER_STATUS.IN_PROGRESS:
      return "text-blue-700 bg-blue-500/20 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/30";
    case ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT:
    case ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT:
    case ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT:
      return "text-purple-700 bg-purple-500/20 dark:text-purple-400 dark:bg-purple-500/10 border border-purple-500/30";
    case ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER:
    case ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR:
      return "text-pink-700 bg-pink-500/20 dark:text-pink-400 dark:bg-pink-500/10 border border-pink-500/30";
    case ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR:
    case ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER:
      return "text-cyan-700 bg-cyan-500/20 dark:text-cyan-400 dark:bg-cyan-500/10 border border-cyan-500/30";
    default:
      return "text-gray-600 bg-gray-500/20 dark:text-gray-400 dark:bg-gray-500/10 border border-gray-500/30";
  }
});
</script>
