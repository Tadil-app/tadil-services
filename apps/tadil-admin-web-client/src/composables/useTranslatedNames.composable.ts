import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useTranslatedNamesComposable(names?: {
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
}) {
  const { locale } = useI18n();
  const translatedName = computed(() => {
    switch (locale.value) {
      case "ar":
        return names?.arabicName ?? "";
      case "hi":
        return names?.hindiName ?? "";
      case "ur":
        return names?.urduName ?? "";
      case "bn":
        return names?.bengaliName ?? "";
      default:
        return names?.englishName ?? "";
    }
  });

  return {
    translatedName,
  };
}
