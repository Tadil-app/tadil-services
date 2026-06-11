<template>
  <div>
    <input
      class="flex h-10 w-full rounded-md bg-background px-3 py-2 text-base outline-0 placeholder:text-muted-foreground md:text-sm disabled:cursor-not-allowed disabled:opacity-50"
      :class="{
        'border border-input': !validationErrorMessage,
        'border border-red-500': validationErrorMessage,
      }"
      v-model="text"
      v-bind="props"
      @blur="emit('blur')"
    />
    <p v-if="validationErrorMessage" class="text-red-500 text-xs">
      {{ validationErrorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
const text = defineModel<string | number | Date>({ required: false });
const emit = defineEmits<{
  (e: "blur"): void;
}>();
const props = withDefaults(
  defineProps<{
    type?: string;
    id?: string;
    placeholder?: string;
    validationErrorMessage?: string;
    disabled?: boolean;
    inputmode?:
      | "text"
      | "search"
      | "url"
      | "email"
      | "tel"
      | "none"
      | "numeric"
      | "decimal";
    pattern?: string;
    maxlength?: number;
  }>(),
  {
    type: "text",
  },
);
</script>
