<template>
  <div
    v-if="total > 0"
    class="flex flex-wrap items-center justify-between gap-3 px-1 py-2 text-sm"
  >
    <span class="text-muted-foreground">
      {{ $t("common.pagination.showing", { from: rangeFrom, to: rangeTo, total }) }}
    </span>
    <div class="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <span class="px-3 text-muted-foreground">
        {{ $t("common.pagination.pageOf", { page, pages: totalPages }) }}
      </span>
      <Button
        variant="outline"
        size="sm"
        :disabled="page >= totalPages"
        @click="go(page + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const rangeFrom = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1));
const rangeTo = computed(() => Math.min(props.page * props.pageSize, props.total));

const go = (target: number) => {
  if (target < 1 || target > totalPages.value || target === props.page) return;
  emit("update:page", target);
};
</script>
