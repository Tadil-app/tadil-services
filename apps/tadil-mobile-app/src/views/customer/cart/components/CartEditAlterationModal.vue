<template>
  <IonModal :isOpen="isOpen" @didDismiss="$emit('close')">
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ $t("cartEdit.title") }}</IonTitle>
        <IonButton
          color="secondary"
          shape="round"
          size="small"
          fill="clear"
          @click="$emit('close')"
        >
          <CircleX slot="icon-only" class="text-2xl" />
        </IonButton>
      </IonToolbar>
      <div v-if="imageUrl && section" class="bg-background">
        <ModelSegmenter
          :imageUrl="imageUrl"
          :section="section.coordinates"
          :alt="section.englishName"
          class="max-h-[30vh]"
        />
        <div
          class="py-2 text-center text-xl font-semibold bg-secondary text-secondary-contrast"
        >
          <TranslatedName :names="section" />
        </div>
      </div>
    </IonHeader>
    <IonContent class="ion-padding">
      <AlterationForm
        v-if="alteration"
        :alterations="availableAlterations"
        :initial-alteration="alteration"
        @confirm="$emit('confirm', $event)"
        @close="$emit('close')"
      />
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
import { TranslatedName, ModelSegmenter } from "@/components";
import { CircleX } from "lucide-vue-next";
import type { SelectedAlteration, SelectedSection } from "@/types/cart.types";
import type { DisplayAlterationDTO } from "@/integration/dtos";
import AlterationForm from "../../components/AlterationForm.vue";

defineProps<{
  isOpen: boolean;
  imageUrl?: string;
  section?: SelectedSection;
  alteration: SelectedAlteration | null;
  availableAlterations: DisplayAlterationDTO[];
}>();

defineEmits<{
  (e: "confirm", updatedAlt: SelectedAlteration): void;
  (e: "close"): void;
}>();
</script>
