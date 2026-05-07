<template>
  <p>{{ translatedName }}</p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const props = defineProps<{
  names: {
    englishName: string;
    arabicName: string;
    bengaliName: string;
    hindiName: string;
    urduName: string;
  };
}>();

const translatedName = computed(() => {
  const map: Record<string, string> = {
    ar: props.names.arabicName,
    hi: props.names.hindiName,
    ur: props.names.urduName,
    bn: props.names.bengaliName,
    en: props.names.englishName,
  };
  return map[locale.value] || props.names.englishName;
});
</script>
