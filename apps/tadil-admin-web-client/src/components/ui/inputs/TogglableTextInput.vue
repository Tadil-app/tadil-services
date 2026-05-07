<template>
  <div>
    <InputLabel :for="key">{{ label }}</InputLabel>
    <div class="grid grid-cols-[1fr_auto] items-center gap-1">
      <TextInput
        :id="key"
        v-model="newValue"
        :validationErrorMessage="isValid ? '' : validationErrorMessage"
        @update:model-value="validateNewValue"
        :disabled="!isEditing"
      />
      <Button
        v-if="!isEditing"
        variant="outline"
        size="icon"
        @click="startEdit"
      >
        <Edit class="h-4 w-4" />
      </Button>
      <div v-else class="flex gap-2">
        <Button size="icon" @click="saveEdit" :disabled="!isValid">
          <Check class="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" @click="cancelEdit">
          <X class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Button from "../Button.vue";
import InputLabel from "./InputLabel.vue";
import TextInput from "./TextInput.vue";
import { Check, Edit, X } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "save", value: string): void;
}>();

const props = defineProps<{
  key: string;
  label: string;
  originalValue: string;
  isRequired: boolean;
  validationErrorMessage?: string;
}>();
const isEditing = defineModel<boolean>({ default: false, required: false });

const newValue = ref<string>(props.originalValue);
const isValid = ref<boolean>(true);

function startEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  newValue.value = props.originalValue;
  isValid.value = true;
  isEditing.value = false;
}

function validateNewValue() {
  if (props.isRequired && !newValue.value) {
    isValid.value = false;
    return;
  }
  isValid.value = true;
}

function saveEdit() {
  validateNewValue();
  if (!isValid.value) return;

  isEditing.value = false;
  emit("save", newValue.value);
}

watch(
  () => props.originalValue,
  (newOriginalValue) => {
    newValue.value = newOriginalValue;
  }
);
</script>
