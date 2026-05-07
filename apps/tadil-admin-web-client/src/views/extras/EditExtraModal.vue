<template>
  <Button variant="outline" size="sm" @click="isOpen = true">
    <Edit />
  </Button>
  <Modal v-model="isOpen" @close-modal="closeModal">
    <div class="space-y-4">
      <h1 class="text-xl font-bold">
        {{ $t("extras.editExtraModal.title") }}
      </h1>
      <div class="flex gap-4">
        <MultiLanguageNameForm ref="namesForm" v-model="localExtra" />
        <div class="space-y-2">
          <InputLabel for="price">
            {{ $t("common.inputs.price.label") }}
          </InputLabel>
          <div class="grid grid-cols-[1fr_auto] items-center gap-2">
            <TextInput
              id="price"
              v-model="localExtra.price"
              placeholder="0.00"
              :validation-error-message="$t(priceValidationError)"
              @update:model-value="validatePrice"
            />
            <p>{{ $t("common.currencies.ras") }}</p>
          </div>
        </div>
      </div>
      <div class="flex justify-evenly">
        <Button variant="outline" @click="closeModal">
          {{ $t("common.buttons.cancel") }}
        </Button>
        <Button @click="updateExtra">
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
  useToast,
} from "@/components";
import {
  apiClient,
  type DisplayExtraDTO,
  type UpdateExtraDTO,
} from "@/integration";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Edit } from "lucide-vue-next";

const { t } = useI18n();
const { openToast } = useToast();

const emit = defineEmits<{
  (e: "updated:extra"): void;
}>();
const props = defineProps<{
  extra: DisplayExtraDTO;
}>();

const isOpen = ref<boolean>(false);

const localExtra = ref<UpdateExtraDTO>({ ...props.extra });
const namesForm = ref<InstanceType<typeof MultiLanguageNameForm>>();

const priceValidationError = ref<string>("");
function validatePrice() {
  if (!localExtra.value.price) {
    priceValidationError.value = "common.inputs.price.errorMessage";
    return false;
  }
  priceValidationError.value = "";
  return true;
}

async function updateExtra() {
  if (!namesForm.value) return;
  try {
    if (namesForm.value.validateForm() && validatePrice()) {
      await apiClient.extrasControllerUpdateExtra(
        props.extra.id,
        localExtra.value
      );
      openToast(t("extras.editExtraModal.success"));
      emit("updated:extra");
      closeModal();
      return;
    }
  } catch (error: any) {
    openToast(
      t("extras.editExtraModal.error"),
      error.response?.data?.message || undefined,
      undefined,
      "destructive"
    );
  }
}

function closeModal() {
  localExtra.value = { ...props.extra };
  isOpen.value = false;
}
</script>
