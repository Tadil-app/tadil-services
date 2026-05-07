<template>
  <div class="space-y-2" :class="{ 'flex flex-wrap gap-2': isInline }">
    <div class="space-y-1.5">
      <InputLabel for="englishName">
        {{ $t("common.inputs.englishName.label") }}
      </InputLabel>
      <TextInput
        id="englishName"
        v-model="names.englishName"
        :placeholder="$t('common.inputs.englishName.placeholder')"
        :validationErrorMessage="$t(validationErrors.englishName)"
        @update:model-value="validateEnglishName"
      />
    </div>
    <div class="space-y-1.5">
      <InputLabel for="arabicName">
        {{ $t("common.inputs.arabicName.label") }}
      </InputLabel>
      <TextInput
        id="arabicName"
        v-model="names.arabicName"
        :placeholder="$t('common.inputs.arabicName.placeholder')"
        :validationErrorMessage="$t(validationErrors.arabicName)"
        @update:model-value="validateArabicName"
      />
    </div>
    <div class="space-y-1.5">
      <InputLabel for="hindiName">
        {{ $t("common.inputs.hindiName.label") }}
      </InputLabel>
      <TextInput
        id="hindiName"
        v-model="names.hindiName"
        :placeholder="$t('common.inputs.hindiName.placeholder')"
        :validationErrorMessage="$t(validationErrors.hindiName)"
        @update:model-value="validateHindiName"
      />
    </div>
    <div class="space-y-1.5">
      <InputLabel for="urduName">
        {{ $t("common.inputs.urduName.label") }}
      </InputLabel>
      <TextInput
        id="urduName"
        v-model="names.urduName"
        :placeholder="$t('common.inputs.urduName.placeholder')"
        :validationErrorMessage="$t(validationErrors.urduName)"
        @update:model-value="validateUrduName"
      />
    </div>
    <div class="space-y-1.5">
      <InputLabel for="bengaliName">
        {{ $t("common.inputs.bengaliName.label") }}
      </InputLabel>
      <TextInput
        id="bengaliName"
        v-model="names.bengaliName"
        :placeholder="$t('common.inputs.bengaliName.placeholder')"
        :validationErrorMessage="$t(validationErrors.bengaliName)"
        @update:model-value="validateBengaliName"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { InputLabel, TextInput } from ".";
import { ref } from "vue";

interface MultiLanguageName {
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
}

const props = withDefaults(
  defineProps<{
    originalNames?: MultiLanguageName;
    isInline?: boolean;
  }>(),
  {
    originalNames: () => ({
      englishName: "",
      arabicName: "",
      hindiName: "",
      urduName: "",
      bengaliName: "",
    }),
    isInline: false,
  }
);
const names = defineModel<MultiLanguageName>({ required: true });

const validationErrors = ref<MultiLanguageName>({
  englishName: "",
  arabicName: "",
  hindiName: "",
  urduName: "",
  bengaliName: "",
});

function validateEnglishName(): boolean {
  if (!names.value.englishName) {
    validationErrors.value.englishName =
      "common.inputs.englishName.errorMessage";
    return false;
  }
  validationErrors.value.englishName = "";
  return true;
}
function validateArabicName(): boolean {
  if (!names.value.arabicName) {
    validationErrors.value.arabicName = "common.inputs.arabicName.errorMessage";
    return false;
  }
  validationErrors.value.arabicName = "";
  return true;
}
function validateHindiName(): boolean {
  if (!names.value.hindiName) {
    validationErrors.value.hindiName = "common.inputs.hindiName.errorMessage";
    return false;
  }
  validationErrors.value.hindiName = "";
  return true;
}
function validateUrduName(): boolean {
  if (!names.value.urduName) {
    validationErrors.value.urduName = "common.inputs.urduName.errorMessage";
    return false;
  }
  validationErrors.value.urduName = "";
  return true;
}
function validateBengaliName(): boolean {
  if (!names.value.bengaliName) {
    validationErrors.value.bengaliName =
      "common.inputs.bengaliName.errorMessage";
    return false;
  }
  validationErrors.value.bengaliName = "";
  return true;
}

function validateForm(): boolean {
  return (
    validateEnglishName() &&
    validateArabicName() &&
    validateHindiName() &&
    validateUrduName() &&
    validateBengaliName()
  );
}

function resetForm() {
  names.value = { ...props.originalNames };
  validationErrors.value = {
    englishName: "",
    arabicName: "",
    hindiName: "",
    urduName: "",
    bengaliName: "",
  };
}

defineExpose({
  validateForm,
  resetForm,
});
</script>
