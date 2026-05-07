<template>
  <Button variant="outline" size="sm" @click="isOpen = true">
    <Edit />
  </Button>
  <Modal v-model="isOpen" @close-modal="closeModal">
    <div class="space-y-4">
      <h1 class="text-xl font-bold">
        {{ $t("alterations.editAlterationModal.title") }}
      </h1>
      <div class="flex gap-4">
        <MultiLanguageNameForm ref="namesForm" v-model="localAlteration" />
        <div class="space-y-2">
          <InputLabel for="price">
            {{ $t("common.inputs.price.label") }}
          </InputLabel>
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <TextInput
              id="price"
              v-model="localAlteration.price"
              placeholder="0.00"
              :validation-error-message="$t(priceValidationError)"
              @update:model-value="validatePrice"
            />
            <p>{{ $t("common.currencies.ras") }}</p>
          </div>
          <InputLabel for="sections">
            {{ $t("common.inputs.sections.label") }}
          </InputLabel>
          <SelectMenu
            v-model="localAlteration.sections"
            :options="sectionsOptions"
            :placeholder="$t('common.inputs.sections.placeholder')"
            multiple
          />
          <InputLabel for="informations">
            {{ $t("common.inputs.informations.label") }}
          </InputLabel>
          <SelectMenu
            v-model="localAlteration.informations"
            :options="informationsOptions"
            :placeholder="$t('common.inputs.informations.placeholder')"
            multiple
          />
        </div>
      </div>
      <div class="flex justify-evenly">
        <Button variant="outline" @click="closeModal">
          {{ $t("common.buttons.cancel") }}
        </Button>
        <Button @click="updateAlteration">
          {{ $t("common.buttons.save") }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import {
  Button,
  Modal,
  MultiLanguageNameForm,
  TextInput,
  InputLabel,
  SelectMenu,
  useToast,
} from "@/components";
import {
  apiClient,
  type DisplayAlterationDTO,
  type UpdateAlterationDTO,
} from "@/integration";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Edit } from "lucide-vue-next";

const { t } = useI18n();
const { openToast } = useToast();

const emit = defineEmits<{
  (e: "updated:alteration"): void;
}>();
const props = defineProps<{
  alteration: DisplayAlterationDTO;
  sectionsOptions: { key: string; label: string }[];
  informationsOptions: { key: string; label: string }[];
}>();

const isOpen = ref<boolean>(false);

const localAlteration = ref<UpdateAlterationDTO>({ ...props.alteration });
const namesForm = ref<InstanceType<typeof MultiLanguageNameForm>>();

const priceValidationError = ref<string>("");
function validatePrice() {
  if (!localAlteration.value.price) {
    priceValidationError.value = "common.inputs.price.errorMessage";
    return false;
  }
  priceValidationError.value = "";
  return true;
}

async function updateAlteration() {
  if (!namesForm.value) return;
  try {
    if (namesForm.value.validateForm() && validatePrice()) {
      await apiClient.alterationsControllerUpdateAlteration(
        props.alteration.id,
        localAlteration.value,
      );
      openToast(t("alterations.editAlterationModal.success"));
      emit("updated:alteration");
      closeModal();
      return;
    }
  } catch (error: any) {
    openToast(
      t("alterations.editAlterationModal.error"),
      error.response?.data?.message || undefined,
      undefined,
      "destructive",
    );
  }
}

function closeModal() {
  localAlteration.value = { ...props.alteration };
  isOpen.value = false;
}
</script>
