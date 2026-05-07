import { computed, type Ref } from "vue";
import { useI18n } from "vue-i18n";

export interface Option {
  key: string;
  label: string;
}

export interface TranslatableEntity {
  id: string;
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
}

export function useOptions(entities: Ref<TranslatableEntity[]>) {
  const { locale } = useI18n();

  const options = computed<Option[]>(() => {
    return entities.value.map((entity) => {
      let label = entity.englishName;
      switch (locale.value) {
        case "ar":
          label = entity.arabicName;
          break;
        case "hi":
          label = entity.hindiName;
          break;
        case "ur":
          label = entity.urduName;
          break;
        case "bn":
          label = entity.bengaliName;
          break;
      }
      return {
        key: entity.id,
        label: label,
      };
    });
  });

  return {
    options,
  };
}
