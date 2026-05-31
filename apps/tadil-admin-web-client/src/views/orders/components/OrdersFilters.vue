<template>
  <div class="flex flex-wrap gap-4 items-end bg-card p-4 rounded-lg border shadow-sm">
    <div class="space-y-1.5">
      <label class="text-xs font-medium uppercase text-muted-foreground">{{ $t("orders.filters.status") }}</label>
      <SelectMenu v-model="filters.status" :options="statusOptions" class="w-48" />
    </div>
    <div class="space-y-1.5">
      <label class="text-xs font-medium uppercase text-muted-foreground">{{ $t("orders.filters.tailor") }}</label>
      <SelectMenu v-model="filters.tailorId" :options="tailorOptions" class="w-48" />
    </div>
    <div class="space-y-1.5">
      <label class="text-xs font-medium uppercase text-muted-foreground">{{ $t("orders.filters.courier") }}</label>
      <SelectMenu v-model="filters.courierId" :options="courierOptions" class="w-48" />
    </div>
    <Button variant="outline" @click="resetFilters">
      {{ $t("orders.buttons.reset") }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { SelectMenu, Button } from "@/components";

const filters = defineModel<{ status: string; tailorId: string; courierId: string }>({
  required: true,
});

defineProps<{
  statusOptions: { key: string; label: string }[];
  tailorOptions: { key: string; label: string }[];
  courierOptions: { key: string; label: string }[];
}>();

const resetFilters = () => {
  filters.value = { status: "all", tailorId: "all", courierId: "all" };
};
</script>
