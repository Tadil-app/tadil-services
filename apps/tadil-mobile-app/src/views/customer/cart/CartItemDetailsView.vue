<template>
  <IonPage>
    <template v-if="cartItem">
      <SecondaryHeader
        :title="cartItem.model"
        default-href="/customer/cart"
      />

      <IonContent class="ion-padding">
        <div class="space-y-4">
          <template
            v-for="image in cartItem.configuration.modelImages"
            :key="image.modelImageId"
          >
            <template v-for="section in image.sections" :key="section.sectionId">
              <CartAlterationItem
                v-for="alt in section.alterations"
                :key="alt.alterationId"
                :model="cartItem.model"
                :image-url="image.imageUrl"
                :section="section"
                :alteration="alt"
                @edit="handleEditAlteration(image.modelImageId, image.imageUrl, section, alt)"
                @delete="handleDeleteAlteration(image.modelImageId, section.sectionId, alt.alterationId)"
              />
            </template>
          </template>
        </div>

        <CartEditAlterationModal
          :is-open="isEditModalOpen"
          :image-url="editingContext?.imageUrl"
          :section="editingContext?.section"
          :alteration="editingAlteration"
          :available-alterations="availableAlterations"
          @confirm="handleConfirmEdit"
          @close="closeEditModal"
        />
      </IonContent>

      <IonFooter class="ion-padding bg-background border-t border-primary/10">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-medium text-sm">{{ $t("cart.totalPrice") }}</p>
            <p class="text-2xl text-tertiary font-extrabold">
              {{ itemTotalPrice }} {{ $t("common.currencies.sar") }}
            </p>
          </div>
        </div>
      </IonFooter>
    </template>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonFooter,
} from "@ionic/vue";
import { computed, ref } from "vue";
import { useCartStore } from "@/stores";
import type { SelectedAlteration, SelectedSection } from "@/types/cart.types";
import { SecondaryHeader } from "@/components";
import { useRouter } from "vue-router";
import { apiClient } from "@/integration/api";
import type { DisplayAlterationDTO } from "@/integration/dtos";
import { calculateConfigurationPrice } from "@/utils";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";
import CartAlterationItem from "./components/CartAlterationItem.vue";
import CartEditAlterationModal from "./components/CartEditAlterationModal.vue";

const props = defineProps<{
  itemId: string;
}>();

const cartStore = useCartStore();
const router = useRouter();
const { showToast } = useToast();
const { t } = useI18n();

const cartItem = computed(() =>
  cartStore.items.find((item) => item.id === props.itemId)
);

const itemTotalPrice = computed(() => {
  if (!cartItem.value) return 0;
  return calculateConfigurationPrice(cartItem.value.configuration);
});

// Edit Logic
const isEditModalOpen = ref(false);
const availableAlterations = ref<DisplayAlterationDTO[]>([]);
const editingAlteration = ref<SelectedAlteration | null>(null);
const editingContext = ref<{ 
  imageId: string; 
  imageUrl: string; 
  section: SelectedSection; 
  alterationId: string 
} | null>(null);

async function handleEditAlteration(
  imageId: string,
  imageUrl: string,
  section: SelectedSection,
  alteration: SelectedAlteration
) {
  editingContext.value = { imageId, imageUrl, section, alterationId: alteration.alterationId };
  editingAlteration.value = alteration;
  
  try {
    const isCustom = cartItem.value?.model.id.startsWith("custom");
    const { data } = await apiClient.customerControllerGetAlterations(
      isCustom ? {} : { sectionId: section.sectionId }
    );
    availableAlterations.value = data;
    isEditModalOpen.value = true;
  } catch (error) {
    showToast({ message: t("common.errors.loadAlterations"), color: "danger" });
  }
}

function closeEditModal() {
  isEditModalOpen.value = false;
  editingAlteration.value = null;
  editingContext.value = null;
}

async function handleConfirmEdit(updatedAlt: SelectedAlteration) {
  if (!cartItem.value || !editingContext.value) return;

  const { imageId, section, alterationId } = editingContext.value;
  const image = cartItem.value.configuration.modelImages.find(i => i.modelImageId === imageId);
  if (image) {
    const targetSection = image.sections.find(s => s.sectionId === section.sectionId);
    if (targetSection) {
      const index = targetSection.alterations.findIndex(a => a.alterationId === alterationId);
      if (index !== -1) {
        targetSection.alterations[index] = updatedAlt;
        await cartStore.saveCart();
      }
    }
  }
  closeEditModal();
}

async function handleDeleteAlteration(imageId: string, sectionId: string, alterationId: string) {
  if (!cartItem.value) return;

  const image = cartItem.value.configuration.modelImages.find(i => i.modelImageId === imageId);
  if (image) {
    const section = image.sections.find(s => s.sectionId === sectionId);
    if (section) {
      section.alterations = section.alterations.filter(a => a.alterationId !== alterationId);
      
      // Cleanup empty sections/images
      if (section.alterations.length === 0) {
        image.sections = image.sections.filter(s => s.sectionId !== sectionId);
      }
      if (image.sections.length === 0) {
        cartItem.value.configuration.modelImages = cartItem.value.configuration.modelImages.filter(i => i.modelImageId !== imageId);
      }
      
      // If no alterations left, remove the whole item
      if (cartItem.value.configuration.modelImages.length === 0) {
        await cartStore.removeItem(props.itemId);
        router.replace({ name: 'customer-cart' });
      } else {
        // Save the updated cart
        await cartStore.saveCart();
      }
    }
  }
}
</script>

<style scoped>
ion-toolbar {
  --background: linear-gradient(to right, #4f46e5, #9333ea);
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 80px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}
</style>
