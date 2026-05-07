<template>
  <div class="h-full flex flex-col justify-between space-y-8">
    <div class="space-y-4">
      <div>
        <label for="alterationType" class="text-lg">
          {{ $t("alterationForm.alterationType") }}
        </label>
        <IonSelect
          id="alterationType"
          name="alterationType"
          v-model="selectedAlteration"
          interface="action-sheet"
          class="border border-border rounded-lg px-4"
          shape="round"
          :placeholder="$t('alterationForm.alterationType')"
          required
          aria-label="Alteration Type Dialog"
          @ion-change="onSelectAlteration"
          :disabled="alterations.length === 0"
        >
          <IonSelectOption
            v-for="alteration in alterations"
            :key="alteration.id"
            :value="alteration"
            :aria-label="alteration.englishName"
            :name="alteration.englishName"
          >
            <TranslatedName :names="alteration" />
          </IonSelectOption>
        </IonSelect>
      </div>
      <p v-if="alterations.length === 0">
        {{ $t("alterationForm.noMoreAlterations") }}
      </p>
      <div
        v-for="information in alterationForm?.informations"
        :key="information.id"
      >
        <template
          v-if="
            information.type === InformationType.Text ||
            information.type === InformationType.Number
          "
        >
          <label
            :for="information.englishName"
            class="flex items-center gap-1 text-lg"
          >
            <TranslatedName :names="information" />
            <span v-if="information.unit">
              ({{ $t(`common.units.${information.unit}`) }})
            </span>
            <span v-if="!information.isRequired" class="text-sm">
              - {{ $t("common.optional") }}
            </span>
          </label>
          <input
            :id="information.englishName"
            :name="information.englishName"
            :aria-label="information.englishName"
            v-model="information.value"
            class="w-full border rounded-lg px-4 py-3 focus:outline outline-primary transition-colors"
            :class="
              validationErrors[information.id]
                ? 'border-red-500'
                : 'border-border'
            "
            type="text"
            :placeholder="
              information.unit ? $t(`common.units.${information.unit}`) : ''
            "
            @input="validationErrors[information.id] = false"
          />
          <p
            v-if="validationErrors[information.id]"
            class="text-red-500 text-sm mt-1"
          >
            {{ $t("common.errors.requiredField") }}
          </p>
        </template>
        <div v-else-if="information.type === InformationType.Checkbox">
          <IonCheckbox
            label-placement="end"
            :required="information.isRequired"
            :checked="information.value === information.extras[0].id"
            class="w-full p-4 bg-step-50 rounded-xl transition-colors border"
            :class="
              validationErrors[information.id]
                ? 'border-red-500'
                : 'border-transparent'
            "
            @ion-change="
              (x) => {
                information.value = x.detail.checked
                  ? information.extras[0].id
                  : undefined;
                validationErrors[information.id] = false;
              }
            "
          >
            <div class="flex gap-2">
              <TranslatedName :names="information" />
              <p>
                (+{{ information.extras[0].price
                }}{{ $t("common.currencies.sar") }})
              </p>
            </div>
          </IonCheckbox>
          <p
            v-if="validationErrors[information.id]"
            class="text-red-500 text-sm mt-1 px-4"
          >
            {{ $t("common.errors.requiredField") }}
          </p>
        </div>
        <template v-else-if="information.type === InformationType.SelectMenu">
          <label
            :for="information.englishName"
            class="flex items-center gap-1 text-lg"
          >
            <TranslatedName :names="information" />
            <span v-if="!information.isRequired" class="text-sm"
              >- {{ $t("common.optional") }}</span
            >
          </label>
          <IonSelect
            :id="information.id"
            :name="information.englishName"
            :model-value="
              information.extras.find((extra) => extra.id === information.value)
            "
            compare-with="id"
            interface="action-sheet"
            class="border rounded-lg px-4 transition-colors"
            :class="
              validationErrors[information.id]
                ? 'border-red-500'
                : 'border-border'
            "
            shape="round"
            :placeholder="$t('alterationForm.alterationType')"
            :required="information.isRequired"
            aria-label="Alteration Type Dialog"
            @ion-change="
              (value) => {
                information.value = value.detail.value.id;
                validationErrors[information.id] = false;
              }
            "
          >
            <IonSelectOption
              v-for="extra in information.extras"
              :key="extra.id"
              :value="extra"
              :aria-label="extra.englishName"
              :name="extra.englishName"
            >
              <div class="w-full flex justify-between">
                <TranslatedName :names="extra" />
                <p>(+{{ extra.price }} {{ $t("common.currencies.sar") }})</p>
              </div>
            </IonSelectOption>
          </IonSelect>
          <p
            v-if="validationErrors[information.id]"
            class="text-red-500 text-sm mt-1"
          >
            {{ $t("common.errors.requiredField") }}
          </p>
        </template>
      </div>
    </div>
    <div class="space-y-4">
      <div
        v-if="alterationForm?.price"
        class="p-2 rounded-lg border border-primary bg-primary/20 divide-y divide-primary *:p-2"
      >
        <div class="flex justify-between items-center">
          <p class="text-sm">{{ $t("alterationForm.extrasPrice") }}</p>
          <p class="text-sm text-tertiary font-semibold">
            +{{ extrasPrice }} {{ $t("common.currencies.sar") }}
          </p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-lg">{{ $t("alterationForm.price") }}</p>
          <p class="text-xl text-tertiary font-semibold">
            {{ alterationForm.price + extrasPrice }}
            {{ $t("common.currencies.sar") }}
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <IonButton fill="outline" color="secondary" @click="close">
          {{ $t("common.buttons.cancel") }}
        </IonButton>
        <IonButton
          fill="solid"
          color="secondary"
          :disabled="!selectedAlteration"
          @click="confirm"
        >
          {{ $t("common.buttons.save") }}
        </IonButton>
      </div>
      <div aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TranslatedName } from "@/components";
import { DisplayAlterationDTO, InformationType } from "@/integration/dtos";
import { IonButton, IonCheckbox, IonSelect, IonSelectOption } from "@ionic/vue";
import { computed, ref, watch } from "vue";
import type { SelectedAlteration } from "@/types/cart.types";

const props = defineProps<{
  alterations: DisplayAlterationDTO[];
  initialAlteration?: SelectedAlteration;
}>();
const emit = defineEmits<{
  (
    e: "confirm",
    alteration: {
      alterationId: string;
      englishName: string;
      arabicName: string;
      hindiName: string;
      urduName: string;
      bengaliName: string;
      price: number;
      informations: {
        informationId: string;
        englishName: string;
        arabicName: string;
        hindiName: string;
        urduName: string;
        bengaliName: string;
        unit?: string;
        value?: string;
      }[];
    },
  ): void;
  (e: "close"): void;
}>();

const selectedAlteration = ref<DisplayAlterationDTO>();
const alterationForm = ref<DisplayAlterationDTO>();
const validationErrors = ref<Record<string, boolean>>({});

watch(
  () => props.initialAlteration,
  (newVal) => {
    validationErrors.value = {};
    if (newVal) {
      const match = props.alterations.find((a) => a.id === newVal.alterationId);
      if (match) {
        selectedAlteration.value = match;
        onSelectAlteration();
        // Pre-fill values
        newVal.informations.forEach((info) => {
          const formInfo = alterationForm.value?.informations.find(
            (i) => i.id === info.informationId
          );
          if (formInfo) {
            formInfo.value = info.value;
          }
        });
      }
    } else {
      selectedAlteration.value = undefined;
      alterationForm.value = undefined;
    }
  },
  { immediate: true }
);

function onSelectAlteration() {
  validationErrors.value = {};
  alterationForm.value = JSON.parse(JSON.stringify(selectedAlteration.value));
  alterationForm.value?.informations.forEach((information) => {
    information.value = undefined;
  });
}

const extrasPrice = computed(() => {
  if (!alterationForm.value) return 0;
  return alterationForm.value.informations.reduce((total, info) => {
    if (
      info.type === InformationType.Checkbox &&
      info.value === info.extras[0].id
    ) {
      return total + info.extras[0].price;
    } else if (info.type === InformationType.SelectMenu) {
      return (
        total +
        (info.extras.find((extra) => extra.id === info.value)?.price ?? 0)
      );
    }
    return total;
  }, 0);
});

function close() {
  selectedAlteration.value = undefined;
  alterationForm.value = undefined;
  validationErrors.value = {};
  emit("close");
}

function validate() {
  validationErrors.value = {};
  if (!alterationForm.value) return false;

  let isValid = true;
  alterationForm.value.informations.forEach((info) => {
    if (info.isRequired && !info.value) {
      validationErrors.value[info.id] = true;
      isValid = false;
    }
  });

  return isValid;
}

function confirm() {
  if (!alterationForm.value || !validate()) return;
  emit("confirm", {
    alterationId: alterationForm.value.id,
    englishName: alterationForm.value.englishName,
    arabicName: alterationForm.value.arabicName,
    hindiName: alterationForm.value.hindiName,
    urduName: alterationForm.value.urduName,
    bengaliName: alterationForm.value.bengaliName,
    price: (selectedAlteration.value?.price ?? 0) + extrasPrice.value,
    informations: alterationForm.value.informations.map((info) => ({
      informationId: info.id,
      englishName: info.englishName,
      arabicName: info.arabicName,
      hindiName: info.hindiName,
      urduName: info.urduName,
      bengaliName: info.bengaliName,
      unit: info.unit,
      value: info.value,
    })),
  });
}
</script>

<style scoped>
ion-checkbox::part(container) {
  border-radius: 6px;
  border: 2px solid #a8c5dd;
}
</style>
