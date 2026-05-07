<template>
  <Button variant="outline" size="sm" @click="isOpen = true">
    <Edit />
  </Button>
  <Modal v-model="isOpen" @close-modal="closeModal">
    <div class="w-xl space-y-4">
      <h1 class="text-xl font-bold">
        {{ $t("informations.editInformationModal.title") }}
      </h1>
      <div class="space-y-1.5">
        <InputLabel for="type">
          {{ $t("common.inputs.infoType.label") }}
        </InputLabel>
        <SelectMenu
          v-model="localInformation.type"
          :options="infoTypeOptions"
          :placeholder="$t('common.inputs.infoType.placeholder')"
        />
      </div>
      <div class="h-16 flex justify-center items-center gap-2">
        <p class="text-sm">
          {{ $t("common.inputs.infoType.options.optional") }}
        </p>
        <ToggleInput v-model="localInformation.isRequired" />
        <p class="text-sm">
          {{ $t("common.inputs.infoType.options.required") }}
        </p>
      </div>
      <div v-if="localInformation.type === InformationType.CHECKBOX">
        <InputLabel for="extras">
          {{ $t("common.inputs.extras.label") }}
        </InputLabel>
        <SelectMenu
          :options="extrasOptions"
          :placeholder="$t('common.inputs.extras.placeholder')"
          @update:model-value="onCheckboxExtraSelected"
        />
      </div>
      <div class="gap-4">
        <MultiLanguageNameForm
          ref="namesForm"
          v-model="localInformation"
          :isInline="true"
        />
        <div class="space-y-2">
          <div
            v-if="localInformation.type === InformationType.NUMBER"
            class="space-y-1.5"
          >
            <InputLabel for="unit">
              {{ $t("common.inputs.unit.label") }}
            </InputLabel>
            <SelectMenu
              v-model="localInformation.unit"
              :options="unitOptions"
              :placeholder="$t('common.inputs.unit.placeholder')"
            />
          </div>
          <div
            v-if="localInformation.type === InformationType.SELECT_MENU"
            class="space-y-2"
          >
            <InputLabel for="extras">
              {{ $t("common.inputs.extras.label") }}
            </InputLabel>
            <SelectMenu
              v-model="localInformation.extras"
              :options="extrasOptions"
              :placeholder="$t('common.inputs.extras.placeholder')"
              multiple
            />
          </div>
        </div>
      </div>
      <div class="flex justify-evenly">
        <Button variant="outline" @click="closeModal">
          {{ $t("common.buttons.cancel") }}
        </Button>
        <Button @click="updateInformation">
          {{ $t("common.buttons.save") }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import {
  Button,
  useToast,
  Modal,
  InputLabel,
  MultiLanguageNameForm,
  ToggleInput,
  SelectMenu,
} from "@/components";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Edit } from "lucide-vue-next";
import {
  apiClient,
  InformationType,
  type DisplayInformationDTO,
  type UpdateInformationDTO,
  type DisplayExtraDTO,
} from "@/integration";

const { t } = useI18n();
const { openToast } = useToast();

const props = defineProps<{
  information: DisplayInformationDTO;
  extras: DisplayExtraDTO[];
  extrasOptions: { key: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: "updated:information"): void;
}>();

const isOpen = ref<boolean>(false);

const infoTypeOptions = computed(() => [
  {
    key: InformationType.TEXT,
    label: t("common.inputs.infoType.options.text"),
  },
  {
    key: InformationType.NUMBER,
    label: t("common.inputs.infoType.options.number"),
  },
  {
    key: InformationType.SELECT_MENU,
    label: t("common.inputs.infoType.options.selectMenu"),
  },
  {
    key: InformationType.CHECKBOX,
    label: t("common.inputs.infoType.options.checkbox"),
  },
]);

const unitOptions = computed(() => [
  { key: "cm", label: t("common.inputs.unit.options.cm") },
  { key: "inch", label: t("common.inputs.unit.options.inch") },
]);

function onCheckboxExtraSelected(extraId?: string | string[]) {
  if (Array.isArray(extraId)) return;
  if (!extraId) return;

  const extra = props.extras.find((extra) => extra.id === extraId);
  if (!extra) return;

  localInformation.value.extras = [extra.id];
  localInformation.value.arabicName = extra.arabicName;
  localInformation.value.englishName = extra.englishName;
  localInformation.value.urduName = extra.urduName;
  localInformation.value.hindiName = extra.hindiName;
  localInformation.value.bengaliName = extra.bengaliName;
}

const localInformation = ref<UpdateInformationDTO>({
  englishName: props.information.englishName,
  arabicName: props.information.arabicName,
  hindiName: props.information.hindiName,
  urduName: props.information.urduName,
  bengaliName: props.information.bengaliName,
  isRequired: props.information.isRequired,
  type: props.information.type,
  extras: props.information.extras,
  unit: props.information.unit,
});

watch(
  () => props.information,
  (newInfo) => {
    localInformation.value = {
      englishName: newInfo.englishName,
      arabicName: newInfo.arabicName,
      hindiName: newInfo.hindiName,
      urduName: newInfo.urduName,
      bengaliName: newInfo.bengaliName,
      isRequired: newInfo.isRequired,
      type: newInfo.type,
      extras: newInfo.extras,
      unit: newInfo.unit,
    };
  }
);

const namesForm = ref<InstanceType<typeof MultiLanguageNameForm>>();

async function updateInformation() {
  if (!namesForm.value) return;
  try {
    if (namesForm.value.validateForm()) {
      await apiClient.informationsControllerUpdateInformation(
        props.information.id,
        localInformation.value
      );
      openToast(t("informations.editInformationModal.success"));
      emit("updated:information");
      closeModal();
      return;
    }
  } catch (error: any) {
    openToast(
      t("informations.editInformationModal.error"),
      error.response?.data?.message || undefined,
      undefined,
      "destructive"
    );
  }
}

function closeModal() {
  localInformation.value = {
    englishName: props.information.englishName,
    arabicName: props.information.arabicName,
    hindiName: props.information.hindiName,
    urduName: props.information.urduName,
    bengaliName: props.information.bengaliName,
    isRequired: props.information.isRequired,
    type: props.information.type,
    extras: props.information.extras,
    unit: props.information.unit,
  };
  isOpen.value = false;
}
</script>
