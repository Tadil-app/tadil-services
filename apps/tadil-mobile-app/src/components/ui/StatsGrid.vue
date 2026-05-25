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
export interface StatItem {
  label: string;
  count: number;
}

defineProps<{
  stats: StatItem[];
}>();
</script>
