<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('customModel.upload')"
      :subtitle="selectedCategory ? $t(`customModel.categories.${selectedCategory}`) : undefined"
      :default-href="`/customer/new-order/${category}/custom-model/custom-category-selection`"
    />

    <IonContent class="ion-padding">
      <div v-if="!customImageUrl" class="h-full flex flex-col justify-center">
        <ImageInput v-model="customImageUrl" />
      </div>

      <div v-else class="space-y-4 pb-20">
        <div
          class="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3 items-center"
        >
          <Info class="text-primary w-6 h-6 shrink-0" />
          <p class="text-sm text-primary font-medium">
            {{ $t("customModel.instructions") }}
          </p>
        </div>

        <div
          class="relative rounded-2xl overflow-hidden shadow-lg border border-medium/20"
        >
          <div
            class="relative inline-block w-full h-full"
            @click="onImageClick"
          >
            <ImageContainer :imageUrl="customImageUrl" alt="Uploaded garment" />

            <!-- Interaction Layer -->
            <div
              v-for="(pin, index) in pinpoints"
              :key="pin.id"
              class="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-tertiary text-tertiary-contrast flex items-center justify-center font-bold border-2 border-white shadow-md animate-in zoom-in duration-200 z-20 pointer-events-auto"
              :style="{
                top: pin.coordinates.y + '%',
                left: pin.coordinates.x + '%',
              }"
              @click.stop="handlePinpointClick(pin)"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <IonButton
          expand="block"
          fill="outline"
          color="medium"
          shape="round"
          @click="changePhoto"
        >
          {{ $t("customModel.changePhoto") }}
        </IonButton>
      </div>

      <!-- Alteration Modal -->
      <IonModal :isOpen="isModalOpen" @didDismiss="closeModal">
        <IonHeader>
          <IonToolbar>
            <IonTitle>{{ $t("alterationForm.alterationType") }}</IonTitle>
            <IonButton slot="end" fill="clear" @click="closeModal">
              <CircleX class="text-2xl" />
            </IonButton>
          </IonToolbar>
          <div
            v-if="clickPosition"
            class="p-4 flex flex-col items-center bg-background border-b border-medium/10"
          >
            <div
              class="w-20 h-20 rounded-full bg-tertiary/10 flex items-center justify-center mb-2"
            >
              <span class="text-2xl font-bold text-tertiary"
                >#{{
                  targetPinpointId
                    ? pinpoints.findIndex((p) => p.id === targetPinpointId) + 1
                    : pinpoints.length + 1
                }}</span
              >
            </div>
            <p class="text-medium text-sm">{{ $t("customModel.pointSelection") }}</p>
          </div>
        </IonHeader>
        <IonContent class="ion-padding">
          <AlterationForm
            :alterations="filteredAlterations"
            :initial-alteration="editingAlteration"
            @confirm="handleConfirmAlteration"
            @close="closeModal"
          />
        </IonContent>
      </IonModal>
    </IonContent>

    <OrderSummaryFooter
      :total-alterations-count="totalAlterationsCount"
      :total-price="totalPrice"
    >
      <template #items>
        <template v-for="(pin, index) in pinpoints" :key="pin.id">
          <AlterationSummaryItem
            v-for="alt in pin.alterations"
            :key="alt.alterationId"
            :index="index + 1"
            :section-names="getPinpointNames(index)"
            :alteration-names="alt"
            :price="alt.price"
            @edit="handleEditAlteration(pin, alt)"
            @delete="removeAlteration(pin.id, alt.alterationId)"
          />
        </template>
      </template>

      <IonButton
        color="tertiary"
        :disabled="isLoading"
        @click="handleAddToCart"
      >
        <IonSpinner v-if="isLoading" name="crescent" size="small" />
        <span v-else>{{ $t("common.buttons.addToCart") }}</span>
      </IonButton>    </OrderSummaryFooter>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonToolbar,
  IonTitle,
  IonSpinner,
  alertController,
  onIonViewWillEnter,
} from "@ionic/vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { ModelCategory, Point } from "@/integration/dtos";
import { ImageContainer, ImageInput, SecondaryHeader } from "@/components";
import { useCustomModel, CustomPinpoint } from "./useCustomModel.composable";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCartStore } from "@/stores";
import { useToast } from "@/composables";
import { CircleX, Info } from "lucide-vue-next";
import AlterationForm from "../../components/AlterationForm.vue";
import AlterationSummaryItem from "../../components/AlterationSummaryItem.vue";
import OrderSummaryFooter from "../../components/OrderSummaryFooter.vue";
import { SelectedAlteration } from "@/types/cart.types";
import { Filesystem, Directory } from "@capacitor/filesystem";

const props = defineProps<{
  category: ModelCategory;
}>();

const {
  customImageUrl,
  selectedCategory,
  pinpoints,
  availableAlterations,
  isLoading,
  totalAlterationsCount,
  totalPrice,
  hasUnsavedChanges,
  getAlterations,
  ensureAlterationsLoaded,
  uploadImage,
  addAlterationToPinpoint,
  createPinpointWithAlteration,
  removeAlteration,
  removePinpoint,
  getPinpointNames,
  reset,
  resetSession,
} = useCustomModel();

const cartStore = useCartStore();
const { showToast } = useToast();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const isModalOpen = ref(false);
const clickPosition = ref<Point | undefined>(undefined);
const targetPinpointId = ref<string | undefined>(undefined);
const editingAlterationId = ref<string | undefined>(undefined);
const editingAlteration = ref<SelectedAlteration | undefined>(undefined);

const filteredAlterations = computed(() => {
  if (!targetPinpointId.value) {
    return availableAlterations.value;
  }

  const pin = pinpoints.value.find((p) => p.id === targetPinpointId.value);
  if (!pin) {
    return availableAlterations.value;
  }

  const existingIds = pin.alterations
    .map((a) => a.alterationId)
    .filter((id) => id !== editingAlterationId.value);

  return availableAlterations.value.filter(
    (alteration) => !existingIds.includes(alteration.id),
  );
});

async function openAlterationModal() {
  const loaded = await ensureAlterationsLoaded();
  if (!loaded) return;
  isModalOpen.value = true;
}

async function onImageClick(event: MouseEvent) {
  const container = event.currentTarget as HTMLElement;
  const img = container.querySelector("img");
  if (!img) return;

  const rect = img.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  if (x < 0 || x > 100 || y < 0 || y > 100) return;

  clickPosition.value = { x, y };
  targetPinpointId.value = undefined;
  editingAlterationId.value = undefined;
  editingAlteration.value = undefined;
  await openAlterationModal();
}

async function handlePinpointClick(pin: CustomPinpoint) {
  const alert = await alertController.create({
    header: t("common.alerts.zoneOptions.header"),
    subHeader: `${pin.alterations.length} ${t("cart.alterations")}`,
    cssClass: "section-alert",
    buttons: [
      {
        text: t("common.alerts.zoneOptions.addNew"),
        cssClass: "btn-add",
        handler: async () => {
          targetPinpointId.value = pin.id;
          clickPosition.value = pin.coordinates;
          editingAlterationId.value = undefined;
          editingAlteration.value = undefined;
          await openAlterationModal();
        },
      },
      {
        text: t("common.alerts.zoneOptions.removeAll"),
        cssClass: "btn-remove",
        handler: () => {
          removePinpoint(pin.id);
        },
      },
      { text: t("common.buttons.cancel"), role: "cancel", cssClass: "btn-cancel" },
    ],
  });
  await alert.present();
}

function handleEditAlteration(
  pin: CustomPinpoint,
  alteration: SelectedAlteration,
) {
  targetPinpointId.value = pin.id;
  editingAlterationId.value = alteration.alterationId;
  editingAlteration.value = alteration;
  clickPosition.value = pin.coordinates;
  void openAlterationModal();
}

async function handleConfirmAlteration(alteration: SelectedAlteration) {
  if (targetPinpointId.value) {
    if (editingAlterationId.value) {
      // It was an edit of an existing alteration
      const pin = pinpoints.value.find((p) => p.id === targetPinpointId.value);
      if (pin) {
        const altIdx = pin.alterations.findIndex(
          (a) => a.alterationId === editingAlterationId.value,
        );
        if (altIdx !== -1) {
          pin.alterations[altIdx] = alteration;
        }
      }
    } else {
      // Adding new alteration to existing pinpoint
      addAlterationToPinpoint(targetPinpointId.value, alteration);
    }
  } else if (clickPosition.value) {
    // New pinpoint entirely
    createPinpointWithAlteration(clickPosition.value, alteration);
  }
  closeModal();
}

function closeModal() {
  isModalOpen.value = false;
  clickPosition.value = undefined;
  targetPinpointId.value = undefined;
  editingAlterationId.value = undefined;
  editingAlteration.value = undefined;
}

async function changePhoto() {
  const alert = await alertController.create({
    header: t("common.alerts.changePhoto.header"),
    message: t("common.alerts.changePhoto.message"),
    buttons: [
      { text: t("common.buttons.cancel"), role: "cancel" },
      {
        text: t("common.buttons.change"),
        role: "confirm",
        handler: () => {
          customImageUrl.value = undefined;
          pinpoints.value = [];
        },
      },
    ],
  });
  await alert.present();
}

async function executeAddToCart() {
  if (!customImageUrl.value || pinpoints.value.length === 0) return false;

  isLoading.value = true;
  try {
    // 1. Persist the image locally instead of uploading now
    const response = await fetch(customImageUrl.value);
    const blob = await response.blob();
    
    // Convert blob to base64 for filesystem storage
    const reader = new FileReader();
    const base64Data = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const fileName = `custom-model-${crypto.randomUUID()}.jpg`;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    const localUrl = savedFile.uri;

    // 2. Prepare Cart Item Configuration
    const customModelId = `custom-${crypto.randomUUID()}`;

    const configuration = {
      modelId: customModelId,
      modelImages: [
        {
          modelImageId: `img-${crypto.randomUUID()}`,
          imageUrl: localUrl, // Store local URI
          sections: pinpoints.value.map((pin, index) => ({
            sectionId: pin.id,
            ...getPinpointNames(index),
            coordinates: [pin.coordinates],
            alterations: pin.alterations,
          })),
        },
      ],
    };

    const customModel = {
      id: customModelId,
      englishName: "Custom Model",
      arabicName: "نموذج مخصص",
      hindiName: "कस्टम मॉडल",
      urduName: "حسب ضرورت ماڈل",
      bengaliName: "কাস্টম মডেল",
      category: props.category,
      thumbnailImageUrl: localUrl, // Store local URI
    };

    await cartStore.addItem(customModel, configuration);
    reset();
    return true;
  } catch (error) {
    console.error("Add to cart failed", error);
    showToast({ message: t("common.errors.addToCartFailed"), color: "danger" });
    return false;
  } finally {
    isLoading.value = false;
  }
}

async function handleAddToCart() {
  const success = await executeAddToCart();
  if (!success) return;

  const alert = await alertController.create({
    header: t("common.alerts.itemAddedOptions.header"),
    message: t("common.alerts.itemAddedOptions.message"),
    backdropDismiss: false,
    cssClass: "section-alert",
    buttons: [
      {
        text: t("common.alerts.itemAddedOptions.continueShopping"),
        cssClass: "btn-cancel",
        handler: () => {
          router.replace({ name: "customer-new-order" });
        },
      },
      {
        text: t("common.alerts.itemAddedOptions.viewCart"),
        cssClass: "btn-add",
        handler: () => {
          router.replace({ name: "customer-cart" });
        },
      },
    ],
  });
  await alert.present();
}

onBeforeRouteLeave(async () => {
  if (hasUnsavedChanges.value) {
    const alert = await alertController.create({
      header: t("common.alerts.unsavedChanges.header"),
      message: t("common.alerts.unsavedChanges.message"),
      cssClass: "section-alert",
      buttons: [
        {
          text: t("common.buttons.cancel"),
          role: "cancel",
          cssClass: "btn-cancel",
        },
        {
          text: t("common.buttons.addToCart"),
          role: "confirm",
          cssClass: "btn-add",
          handler: () => {
            return executeAddToCart();
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === "confirm";
  }
  return true;
});

onIonViewWillEnter(() => {
  const customCategoryFromQuery = route.query.customCategory;
  if (typeof customCategoryFromQuery === "string") {
    selectedCategory.value = customCategoryFromQuery;
  }

  if (!selectedCategory.value) {
    router.replace({
      name: "customer-new-order-custom-category-selection",
      params: { category: props.category },
    });
    return;
  }
  getAlterations();
});

onBeforeUnmount(() => {
  resetSession();
});
</script>

<style scoped>
ion-toolbar {
  --background: linear-gradient(to right, #4f46e5, #9333ea);
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 80px;
  --padding-top: calc(var(--ion-safe-area-top, 0px) + 20px);
  --padding-bottom: 20px;
}
</style>
