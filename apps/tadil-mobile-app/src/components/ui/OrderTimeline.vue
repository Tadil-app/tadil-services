<template>
  <div class="bg-card rounded-2xl p-4 shadow-sm">
    <h3 class="text-lg font-bold mb-4">{{ $t('order.history.title') }}</h3>
    <div class="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
      <div v-for="(h, index) in history" :key="index" class="flex gap-4 relative">
        <div 
          class="w-6 h-6 rounded-full border-4 border-card flex-shrink-0 z-10 flex items-center justify-center"
          :class="index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
        <div class="flex-grow pt-0.5">
          <p class="text-sm font-semibold" :class="index === 0 ? 'text-primary' : 'text-muted-foreground'">
            {{ $t('orderStatus.' + h.status) }}
          </p>
          <p class="text-[10px] text-muted-foreground mt-0.5">
            {{ formatDate(h.timestamp) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type OrderStatusHistoryDTO } from '@/integration/dtos';
import { formatDate } from '@/utils';

defineProps<{
  history: OrderStatusHistoryDTO[];
}>();
</script>

<style scoped>
</style>
