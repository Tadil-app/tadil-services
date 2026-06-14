<template>
  <div>
    <DropdownMenu
      @hide="onHide"
      @shown="onShown"
      :matchTriggerContentWidth="matchTriggerContentWidth"
    >
    <template #trigger>
      <button
        type="button"
        class="flex h-10 w-full min-w-0 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
      >
        <span :class="{ 'text-muted-foreground': !selectedLabel }" class="truncate">
          {{ selectedLabel || $t(placeholder) }}
        </span>
        <ChevronDown class="h-4 w-4 opacity-50 shrink-0" />
      </button>
    </template>
    <template #content="{ hide }">
      <div
        class="min-w-48 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
      >
        <div class="p-2 border-b">
          <div class="flex items-center gap-2 rounded-md border border-input px-2">
            <Search class="h-4 w-4 opacity-50 shrink-0" />
            <input
              ref="searchInput"
              v-model="searchText"
              :placeholder="$t(searchPlaceholder)"
              class="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              @input="onInput"
            />
          </div>
        </div>
        <ul class="max-h-72 overflow-y-auto p-1">
          <li
            v-if="isLoading"
            class="flex items-center justify-center py-4 text-muted-foreground"
          >
            <Loader2 class="h-4 w-4 animate-spin" />
          </li>
          <template v-else>
            <li
              v-if="clearable"
              class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              @click="onSelect('', ''), hide()"
            >
              <span
                v-if="!modelValue"
                class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
              >
                <Check class="h-4 w-4" />
              </span>
              {{ $t(clearLabel) }}
            </li>
            <li
              v-for="option in options"
              :key="option.key"
              class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground"
              @click="onSelect(option.key, option.label), hide()"
            >
              <span
                v-if="modelValue === option.key"
                class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
              >
                <Check class="h-4 w-4" />
              </span>
              {{ option.label }}
            </li>
            <li
              v-if="options.length === 0"
              class="py-4 text-center text-sm text-muted-foreground"
            >
              {{ $t(emptyLabel) }}
            </li>
          </template>
        </ul>
      </div>
    </template>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import DropdownMenu from "./DropdownMenu.vue";
import { ChevronDown, Check, Search, Loader2 } from "lucide-vue-next";

const modelValue = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    options: { key: string; label: string }[];
    // Label of the currently selected item; kept by the parent so it shows even
    // when the selected option is not part of the current (paged) result set.
    selectedLabel?: string;
    isLoading?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyLabel?: string;
    clearable?: boolean;
    clearLabel?: string;
    matchTriggerContentWidth?: boolean;
    debounce?: number;
  }>(),
  {
    selectedLabel: "",
    isLoading: false,
    placeholder: "common.inputs.searchableSelect.placeholder",
    searchPlaceholder: "common.inputs.searchableSelect.searchPlaceholder",
    emptyLabel: "common.inputs.searchableSelect.empty",
    clearable: true,
    clearLabel: "common.inputs.searchableSelect.all",
    matchTriggerContentWidth: true,
    debounce: 350,
  }
);

const emit = defineEmits<{
  (e: "search", value: string): void;
  // Emitted with both key and label so the parent can persist the chosen label.
  (e: "selected", value: { key: string; label: string }): void;
}>();

const searchText = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit("search", searchText.value.trim());
  }, props.debounce);
};

const onShown = () => {
  // Load an initial (unfiltered) page and focus the search box.
  emit("search", searchText.value.trim());
  nextTick(() => searchInput.value?.focus());
};

const onHide = () => {
  searchText.value = "";
};

const onSelect = (key: string, label: string) => {
  modelValue.value = key;
  emit("selected", { key, label });
};
</script>
