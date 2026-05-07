<template>
  <div>
    <DropdownMenu
      @hide="filterInputText = ''"
      :matchTriggerContentWidth="matchTriggerContentWidth"
    >
      <template #trigger>
        <slot>
          <button
            class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            :class="{
              'border border-input': !validationErrorMessage,
              'border border-red-500': validationErrorMessage,
            }"
          >
            <Filter v-if="isFilterIcon" class="h-4 w-4 mr-2" />
            <span>
              {{
                !multiple && selectedOptionLabel
                  ? selectedOptionLabel
                  : $t(placeholder)
              }}
            </span>
            <ChevronDown class="h-4 w-4 opacity-50" />
          </button>
        </slot>
      </template>
      <template #content="{ hide }">
        <ul
          class="max-h-96 min-w-32 p-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <li
            v-for="option in filteredOptions"
            class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            @click="onSelectOption(option.key), !multiple ? hide() : null"
          >
            <span
              v-if="
                (multiple && selectedOptions?.includes(option.key)) ||
                (!multiple && selectedOptions === option.key)
              "
              class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
            >
              <Check class="h-4 w-4" />
            </span>
            {{ option.label }}
          </li>
        </ul>
      </template>
    </DropdownMenu>
    <p v-if="validationErrorMessage" class="text-red-500 text-xs">
      {{ validationErrorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import DropdownMenu from "./DropdownMenu.vue";
import { ChevronDown, Check, Filter } from "lucide-vue-next";

const selectedOptions = defineModel<string | string[]>();
const props = withDefaults(
  defineProps<{
    options: {
      key: string;
      label: string;
    }[];
    isFilterIcon?: boolean;
    isFilterable?: boolean;
    validationErrorMessage?: string;
    matchTriggerContentWidth?: boolean;
    placeholder?: string;
    multiple?: boolean;
  }>(),
  {
    isFilterIcon: false,
    isFilterable: false,
    validationErrorMessage: undefined,
    matchTriggerContentWidth: true,
    placeholder: "inputs.selectMenu.placeholder",
    multiple: false,
  }
);
const selectedOptionLabel = computed(() =>
  props.multiple
    ? ""
    : props.options.find((option) => option.key === selectedOptions.value)
        ?.label
);

const filterInputText = ref<string>("");
const filteredOptions = computed(() => {
  return props.options.filter((option) => {
    return option.label
      .toLowerCase()
      .includes(filterInputText.value.toLowerCase());
  });
});

function onSelectOption(optionKey: string) {
  if (!props.multiple) {
    selectedOptions.value = optionKey;
    return;
  }
  if (selectedOptions.value && !selectedOptions.value.includes(optionKey)) {
    selectedOptions.value = [...selectedOptions.value, optionKey];
    return;
  } else {
    selectedOptions.value = (selectedOptions.value as string[]).filter(
      (option) => option !== optionKey
    );
    return;
  }
}
</script>
