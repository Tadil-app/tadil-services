<template>
  <Button @click="isOpen = true">
    {{ $t(`users.addNewUserModal.title`) }}
  </Button>
  <Modal v-model="isOpen" @close-modal="closeModal">
    <div class="space-y-4">
      <h1 class="text-xl font-bold">
        {{ $t(`users.addNewUserModal.title`) }}
      </h1>
      <div class="space-y-2">
        <div class="space-y-1.5">
          <InputLabel for="userRole">
            {{ $t("common.inputs.userRole.label") }}
          </InputLabel>
          <SelectMenu v-model="selectedUserRole" :options="userRoleOptions" />
        </div>
        <div class="space-y-1.5">
          <InputLabel for="phone">
            {{ $t("common.inputs.phone.label") }}
          </InputLabel>
          <TextInput
            id="phone"
            type="tel"
            inputmode="tel"
            pattern="[0-9]*"
            :maxlength="10"
            v-model="newUser.phone"
            :placeholder="$t('common.inputs.phone.placeholder')"
            :validationErrorMessage="$t(newUserValidationErrors.phone)"
            @update:model-value="validateUserPhone"
          />
        </div>
        <div class="space-y-1.5">
          <InputLabel for="firstName">
            {{ $t("common.inputs.firstName.label") }}
          </InputLabel>
          <TextInput
            id="firstName"
            v-model="newUser.firstName"
            :placeholder="$t('common.inputs.firstName.placeholder')"
            :validationErrorMessage="$t(newUserValidationErrors.firstName)"
            @update:model-value="validateUserFirstName"
          />
        </div>
        <div class="space-y-1.5">
          <InputLabel for="lastName">
            {{ $t("common.inputs.lastName.label") }}
          </InputLabel>
          <TextInput
            id="lastName"
            v-model="newUser.lastName"
            :placeholder="$t('common.inputs.lastName.placeholder')"
            :validationErrorMessage="$t(newUserValidationErrors.lastName)"
            @update:model-value="validateUserLastName"
          />
        </div>
        <div class="space-y-1.5">
          <InputLabel for="email">
            {{ $t("common.inputs.email.label") }}
          </InputLabel>
          <TextInput
            id="email"
            type="email"
            v-model="newUser.email"
            :placeholder="$t('common.inputs.email.placeholder')"
          />
        </div>
      </div>
      <div class="flex justify-evenly">
        <Button variant="outline" @click="closeModal">
          {{ $t("common.buttons.cancel") }}
        </Button>
        <Button @click="createUser">
          {{ $t("common.buttons.add") }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import {
  Modal,
  useToast,
  TextInput,
  InputLabel,
  SelectMenu,
} from "@/components";
import Button from "@/components/ui/Button.vue";
import {
  apiClient,
  ROLE,
  type CreateUserDTO,
  type RoleType,
} from "@/integration";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { openToast } = useToast();

const props = defineProps<{
  selectedUserType: RoleType;
  userRoleOptions: { key: RoleType; label: string }[];
}>();

const selectedUserRole = ref<RoleType>(props.selectedUserType);

const emit = defineEmits<{
  (e: "created:user"): void;
}>();

const isOpen = ref<boolean>(false);
const newUser = ref<CreateUserDTO>({
  phone: "",
  firstName: "",
  lastName: "",
  email: undefined,
});
const newUserValidationErrors = ref({
  phone: "",
  firstName: "",
  lastName: "",
});

function validateUserPhone() {
  if (!newUser.value.phone) {
    newUserValidationErrors.value.phone = t(
      "common.inputs.phone.undefinedErrorMessage",
    );
    return false;
  }
  if (newUser.value.phone.length < 10) {
    newUserValidationErrors.value.phone = t(
      "common.inputs.phone.lengthErrorMessage",
    );
    return false;
  }
  if (isNaN(Number(newUser.value.phone))) {
    newUserValidationErrors.value.phone = t(
      "common.inputs.phone.numericErrorMessage",
    );
    return false;
  }
  newUserValidationErrors.value.phone = "";
  return true;
}
function validateUserFirstName() {
  if (!newUser.value.firstName) {
    newUserValidationErrors.value.firstName = t(
      "common.inputs.firstName.errorMessage",
    );
    return false;
  }
  newUserValidationErrors.value.firstName = "";
  return true;
}
function validateUserLastName() {
  if (!newUser.value.lastName) {
    newUserValidationErrors.value.lastName = t(
      "common.inputs.lastName.errorMessage",
    );
    return false;
  }
  if (newUser.value.lastName.length < 2) {
    newUserValidationErrors.value.lastName = t(
      "common.inputs.lastName.errorMessage",
    );
    return false;
  }
  newUserValidationErrors.value.lastName = "";
  return true;
}

async function createUser() {
  try {
    if (
      validateUserPhone() &&
      validateUserFirstName() &&
      validateUserLastName()
    ) {
      switch (selectedUserRole.value) {
        case ROLE.TAILOR: {
          await apiClient.tailorsControllerCreateTailor(newUser.value);
          break;
        }
        case ROLE.COURIER: {
          await apiClient.couriersControllerCreateCourier(newUser.value);
          break;
        }
      }
      openToast(t(`users.addNewUserModal.success`));
      emit("created:user");
      closeModal();
      return;
    }
  } catch (error: any) {
    openToast(
      t(`users.addNewUserModal.error`),
      error?.response?.data?.message || undefined,
      undefined,
      "destructive",
    );
  }
}

function closeModal() {
  newUser.value = {
    phone: "",
    firstName: "",
    lastName: "",
    email: undefined,
  };
  isOpen.value = false;
}
</script>
