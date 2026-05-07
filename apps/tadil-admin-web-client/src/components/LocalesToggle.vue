<template>
  <DropdownMenu>
    <template #trigger>
      <Button variant="ghost">
        <Languages class="w-5 h-5" />
      </Button>
    </template>
    <template #content="{ hide }">
      <ul
        class="max-h-96 min-w-32 p-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
      >
        <li
          v-for="locale in localesOptions"
          class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          @click="changeLocale(locale), hide()"
        >
          <span
            v-if="currentLocale.key === locale.key"
            class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
          >
            <Check class="h-4 w-4" />
          </span>
          {{ locale.label }}
        </li>
      </ul>
    </template>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Check, Languages } from "lucide-vue-next";
import { Button } from "./ui";
import { useI18n } from "vue-i18n";
import DropdownMenu from "./ui/DropdownMenu.vue";

type Locale = {
  key: string;
  label: string;
  direction: string;
};
const { locale } = useI18n();
const currentLocale = ref<Locale>({
  key: "ar",
  label: "العربية",
  direction: "rtl",
});
const localesOptions: {
  key: string;
  label: string;
  direction: string;
}[] = [
  { key: "en", label: "English", direction: "ltr" },
  { key: "ar", label: "العربية", direction: "rtl" },
  // { key: "hi", label: "हिंदी भाषा", direction: "ltr" },
  // { key: "ur", label: "اردو", direction: "rtl" },
  // { key: "bn", label: "বাংলা", direction: "ltr" },
];

function changeLocale(newLocale: Locale) {
  locale.value = newLocale.key;
  currentLocale.value = newLocale;
  localStorage.setItem("locale", currentLocale.value.key);
  document.documentElement.setAttribute("dir", currentLocale.value.direction);
}

onMounted(() => {
  const savedLocale = localStorage.getItem("locale") ?? "ar";
  locale.value = savedLocale;
  currentLocale.value = localesOptions.find(
    (l) => l.key === savedLocale
  ) ?? {
    key: "ar",
    label: "العربية",
    direction: "rtl",
  };
  document.documentElement.setAttribute("dir", currentLocale.value.direction);
});
</script>
