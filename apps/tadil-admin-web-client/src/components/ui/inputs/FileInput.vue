<template>
  <div>
    <input
      class="flex h-10 w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-sm disabled:cursor-not-allowed disabled:opacity-50"
      :class="{
        'focus-visible:ring-ring border border-input': !validationErrorMessage,
        'focus-visible:ring-red-500 border border-red-500':
          validationErrorMessage,
      }"
      type="file"
      @change="handleFileInputChange"
      v-bind="props"
    />
    <p v-if="validationErrorMessage" class="text-red-500 text-xs">
      {{ validationErrorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
const input = defineModel<File | File[]>();

const props = withDefaults(
  defineProps<{
    id?: string;
    multiple?: boolean;
    accept?: string;
    placeholder?: string;
    validationErrorMessage?: string;
    disabled?: boolean;
  }>(),
  {
    multiple: false,
  }
);

function handleFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  if (props.multiple) {
    input.value = files;
  } else {
    input.value = files[0];
  }
}
</script>
