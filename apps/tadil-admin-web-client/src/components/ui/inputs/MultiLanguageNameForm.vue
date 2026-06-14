<template>
  <div class="space-y-3">
    <div class="flex items-center justify-end gap-2">
      <Languages class="h-3.5 w-3.5 text-muted-foreground" />
      <span class="text-xs font-medium text-muted-foreground">
        {{ $t("common.inputs.autoTranslate.label") }}
      </span>
      <ToggleInput v-model="autoTranslateEnabled" />
    </div>
    <div
      class="grid gap-x-4 gap-y-3"
      :class="isInline ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'"
    >
      <div class="space-y-1.5">
        <InputLabel for="englishName">
          {{ $t("common.inputs.englishName.label") }}
        </InputLabel>
        <TextInput
          id="englishName"
          v-model="names.englishName"
          :placeholder="$t('common.inputs.englishName.placeholder')"
          :validationErrorMessage="$t(validationErrors.englishName)"
          @update:model-value="onFieldInput('englishName')"
          @blur="onFieldBlur('englishName')"
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
          @update:model-value="onFieldInput('arabicName')"
          @blur="onFieldBlur('arabicName')"
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
          @update:model-value="onFieldInput('hindiName')"
          @blur="onFieldBlur('hindiName')"
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
          @update:model-value="onFieldInput('urduName')"
          @blur="onFieldBlur('urduName')"
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
          @update:model-value="onFieldInput('bengaliName')"
          @blur="onFieldBlur('bengaliName')"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { InputLabel, TextInput, ToggleInput } from ".";
import { Languages } from "lucide-vue-next";
import { ref } from "vue";
import {
  useTranslateNameComposable,
  type NameLanguage,
} from "@/composables";

interface MultiLanguageName {
  englishName: string;
  arabicName: string;
  hindiName: string;
  urduName: string;
  bengaliName: string;
}

type NameField = keyof MultiLanguageName;

// Tracks how each field's current value was produced. "manual" values (typed
// by the user or pre-filled in edit mode) are never overwritten by translation;
// "auto" and "empty" values may be (re)filled when a source field changes.
type FieldOrigin = "manual" | "auto" | "empty";

const FIELDS: NameField[] = [
  "englishName",
  "arabicName",
  "hindiName",
  "urduName",
  "bengaliName",
];

const FIELD_LANGUAGE: Record<NameField, NameLanguage> = {
  englishName: "en",
  arabicName: "ar",
  hindiName: "hi",
  urduName: "ur",
  bengaliName: "bn",
};

const LANGUAGE_FIELD: Record<NameLanguage, NameField> = {
  en: "englishName",
  ar: "arabicName",
  hi: "hindiName",
  ur: "urduName",
  bn: "bengaliName",
};

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

const { translateInto } = useTranslateNameComposable();

const VALIDATORS: Record<NameField, () => boolean> = {
  englishName: validateEnglishName,
  arabicName: validateArabicName,
  hindiName: validateHindiName,
  urduName: validateUrduName,
  bengaliName: validateBengaliName,
};

const autoTranslateEnabled = ref<boolean>(true);

function initialOrigin(field: NameField): FieldOrigin {
  // Values pre-filled in edit mode are treated as overwritable ("auto"), not
  // user-owned. A field only becomes "manual" (protected) once the user types
  // into it this session — otherwise editing one field in an edit modal would
  // have no targets to translate into, since everything would be locked.
  return names.value[field]?.trim() ? "auto" : "empty";
}

// Per-field provenance, seeded from whatever the model already holds.
const fieldOrigin = ref<Record<NameField, FieldOrigin>>({
  englishName: initialOrigin("englishName"),
  arabicName: initialOrigin("arabicName"),
  hindiName: initialOrigin("hindiName"),
  urduName: initialOrigin("urduName"),
  bengaliName: initialOrigin("bengaliName"),
});

// The last source value we translated from, per source field. Lets us skip
// redundant re-translation when a blur fires without a real change.
const lastTranslatedSource = ref<Record<NameField, string>>({
  englishName: "",
  arabicName: "",
  hindiName: "",
  urduName: "",
  bengaliName: "",
});

// Monotonic token so a slow in-flight translation can't clobber a newer one.
let translationToken = 0;

// True while we programmatically write translations, so the resulting
// update:model-value events aren't misread as manual user edits.
let isApplyingTranslation = false;

// Called on every keystroke: a user edit marks the field as manually owned,
// unless the change came from us writing a translation (guarded above).
function onFieldInput(field: NameField) {
  if (isApplyingTranslation) {
    VALIDATORS[field]();
    return;
  }
  fieldOrigin.value[field] = names.value[field]?.trim() ? "manual" : "empty";
  VALIDATORS[field]();
}

// On blur, translate the (changed) source into every target that isn't manually
// owned. Manual targets are preserved; empty and previously auto-filled targets
// (including values pre-filled in edit mode) are (re)written so edits propagate.
async function onFieldBlur(field: NameField) {
  if (!autoTranslateEnabled.value) return;

  // Only a field the user actually edited this session drives translation, so
  // merely focusing/blurring pre-filled fields doesn't regenerate everything.
  if (fieldOrigin.value[field] !== "manual") return;

  const sourceValue = names.value[field]?.trim();
  if (!sourceValue) return;
  if (sourceValue === lastTranslatedSource.value[field]) return;
  lastTranslatedSource.value[field] = sourceValue;

  const source = FIELD_LANGUAGE[field];
  const targetFields = FIELDS.filter(
    (f) => f !== field && fieldOrigin.value[f] !== "manual"
  );
  if (targetFields.length === 0) return;

  const token = ++translationToken;
  const targetLanguages = targetFields.map((f) => FIELD_LANGUAGE[f]);

  const translations = await translateInto(
    sourceValue,
    source,
    targetLanguages
  );

  // A newer translation (or a manual edit elsewhere) superseded this one.
  if (token !== translationToken) return;

  isApplyingTranslation = true;
  try {
    for (const [language, value] of Object.entries(translations)) {
      const targetField = LANGUAGE_FIELD[language as NameLanguage];
      // Re-check ownership: the user may have typed into this field meanwhile.
      if (value && fieldOrigin.value[targetField] !== "manual") {
        names.value[targetField] = value;
        fieldOrigin.value[targetField] = "auto";
        // Mark this auto value as "already translated from" so simply blurring
        // the field doesn't re-translate the translation. A real user edit flips
        // it to "manual" and changes the text, which still propagates.
        lastTranslatedSource.value[targetField] = value;
        VALIDATORS[targetField]();
      }
    }
  } finally {
    isApplyingTranslation = false;
  }
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
  for (const field of FIELDS) {
    fieldOrigin.value[field] = initialOrigin(field);
    lastTranslatedSource.value[field] = "";
  }
}

defineExpose({
  validateForm,
  resetForm,
});
</script>
