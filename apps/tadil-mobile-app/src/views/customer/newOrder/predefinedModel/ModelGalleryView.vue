<template>
  <IonPage>
    <template v-if="selectedModel && selectedImage">
      <SecondaryHeader
        :title="selectedModel"
        :default-href="`/customer/new-order/${category}/predefined/model-selection`"
        :showBackButton="true"
      />
      <IonContent class="ion-padding space-y-2">
        <SectionsSlider
          :direction="currentLocale.direction"
          :sections="selectedImage!.sections"
        />
        <Swiper
          :dir="currentLocale.direction"
          :style="{
            '--swiper-pagination-color': '#d6613d',
          }"
          :spaceBetween="12"
          :pagination="true"
          :modules="[Thumbs, FreeMode, Pagination]"
          :thumbs="{ swiper: thumbsSwiper }"
          :threshold="5"
          :watchSlidesProgress="true"
          :normalizeSlideIndex="true"
          @activeIndexChange="onSwiperActiveSlideChange"
        >
          <SwiperSlide v-for="image in modelImages" :key="image.id">
            <ImageContainer
              :imageUrl="image.imageUrl"
              :alt="selectedModel.englishName"
              class="max-h-120"
              :isSegmenter="true"
              @segmenter:clicked="findSectionAtPoint"
            />
          </SwiperSlide>
        </Swiper>
        <Swiper
          :dir="currentLocale.direction"
          @swiper="setThumbsSwiper"
          :spaceBetween="12"
          :slidesPerView="3"
          :freeMode="true"
          :modules="[Thumbs, FreeMode]"
          :watchSlidesProgress="true"
          :slideToClickedSlide="true"
          :threshold="5"
        >
          <SwiperSlide
            v-for="image in modelImages"
            :key="image.id"
            class="aspect-square rounded-lg border-2 border-primary/40 overflow-hidden"
          >
            <ImageContainer
              :imageUrl="image.imageUrl"
              :alt="selectedModel!.englishName"
            />
          </SwiperSlide>
        </Swiper>
        <IonModal v-if="selectedSection" :isOpen="!!selectedSection">
          <IonHeader>
            <IonButton
              color="secondary"
              shape="round"
              size="small"
              fill="clear"
              class="absolute top-4 right-4 flex items-center justify-center"
              @click="selectedSection = undefined"
            >
              <CircleX slot="icon-only" class="text-2xl" />
            </IonButton>
            <ModelSegmenter
              :imageUrl="selectedImage.imageUrl"
              :section="selectedSection.coordinates"
              :alt="selectedSection.englishName"
              class="max-h-[30vh]"
            />
            <div
              class="py-2 text-center text-xl font-semibold bg-secondary text-secondary-contrast"
            >
              <TranslatedName :names="selectedSection" />
            </div>
          </IonHeader>
          <IonContent class="ion-padding">
            <AlterationForm
              :alterations="filteredAlterations"
              :initial-alteration="currentEditingAlteration"
              @confirm="handleConfirmAlteration"
              @close="onCloseModal"
            />
          </IonContent>
        </IonModal>
      </IonContent>
      <OrderSummaryFooter
        :total-alterations-count="totalAlterationsCount"
        :total-price="totalPrice"
      >
        <template #items>
          <template
            v-for="image in modelItems?.modelImages"
            :key="image.modelImageId"
          >
            <template
              v-for="section in image.sections"
              :key="section.sectionId"
            >
              <AlterationSummaryItem
                v-for="alt in section.alterations"
                :key="alt.alterationId"
                :section-names="section"
                :alteration-names="alt"
                :price="alt.price"
                @edit="handleEditAlteration(image.modelImageId, section, alt)"
                @delete="
                  removeAlteration(
                    image.modelImageId,
                    section.sectionId,
                    alt.alterationId,
                  )
                "
              />
            </template>
          </template>
        </template>

        <IonButton color="tertiary" @click="handleAddToCart">
          {{ $t("common.buttons.addToCart") }}
        </IonButton>
      </OrderSummaryFooter>
    </template>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
} from "@ionic/vue";
import { onBeforeMount, ref } from "vue";
import { ModelCategory } from "@/integration/dtos";
import {
  TranslatedName,
  ImageContainer,
  ModelSegmenter,
  SecondaryHeader,
} from "@/components";
import { usePredefinedModel } from "./usePredefinedModel.composable";
import { Swiper, SwiperSlide } from "swiper/vue";
import type { Swiper as SwiperType } from "swiper";
import { Thumbs, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useCartStore, useLanguageStore } from "@/stores";
import SectionsSlider from "./components/SectionsSlider.vue";
import { CircleX } from "lucide-vue-next";
import AlterationForm from "../../components/AlterationForm.vue";
import AlterationSummaryItem from "../../components/AlterationSummaryItem.vue";
import OrderSummaryFooter from "../../components/OrderSummaryFooter.vue";
import { alertController } from "@ionic/vue";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";
import { SelectedAlteration, SelectedSection } from "@/types/cart.types";

const { currentLocale } = useLanguageStore();
const { addItem } = useCartStore();
const { showToast } = useToast();
const { t } = useI18n();
const props = defineProps<{
  category: ModelCategory;
  modelId: string;
}>();

const {
  selectedModel,
  modelImages,
  selectedImage,
  selectedSection,
  filteredAlterations,
  modelItems,
  totalAlterationsCount,
  totalPrice,
  hasUnsavedChanges,
  getModelImages,
  addAlteration,
  removeAlteration,
  findSectionAtPoint,
  resetSelection,
  editingAlterationId,
} = usePredefinedModel();

const currentEditingAlteration = ref<SelectedAlteration>();
const editingMeta = ref<{ imageId: string; sectionId: string }>();

const thumbsSwiper = ref<SwiperType | null>(null);
const setThumbsSwiper = (swiper: SwiperType) => {
  thumbsSwiper.value = swiper;
};
function onSwiperActiveSlideChange(swiper: SwiperType) {
  const newIndex = swiper.activeIndex;
  if (selectedImage.value?.id !== modelImages.value[newIndex]?.id) {
    selectedImage.value = modelImages.value[newIndex];
  }
}

const router = useRouter();

function handleEditAlteration(
  imageId: string,
  section: SelectedSection,
  alteration: SelectedAlteration,
) {
  const img = modelImages.value.find((i) => i.id === imageId);
  if (img) {
    selectedImage.value = img;
    const originalSection = img.sections.find(
      (s) => s.id === section.sectionId,
    );
    if (originalSection) {
      editingAlterationId.value = alteration.alterationId;
      currentEditingAlteration.value = alteration;
      editingMeta.value = { imageId, sectionId: section.sectionId };
      selectedSection.value = originalSection;
    }
  }
}

async function handleConfirmAlteration(data: SelectedAlteration) {
  if (editingMeta.value && editingAlterationId.value) {
    removeAlteration(
      editingMeta.value.imageId,
      editingMeta.value.sectionId,
      editingAlterationId.value,
    );
  }
  addAlteration(data);
  onCloseModal();
}

function onCloseModal() {
  selectedSection.value = undefined;
  editingAlterationId.value = undefined;
  currentEditingAlteration.value = undefined;
  editingMeta.value = undefined;
}

async function executeAddToCart() {
  if (!selectedModel.value || !modelItems.value) return false;

  if (totalAlterationsCount.value === 0) {
    showToast({
      message: t("common.alerts.noAlterations"),
      color: "warning",
    });
    return false;
  }

  await addItem(selectedModel.value, modelItems.value);
  resetSelection();
  return true;
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

onBeforeMount(async () => {
  if (!selectedModel.value) {
    router.replace({
      name: "customer-new-order-predefined-model-selection",
      params: { category: props.category },
    });
    return;
  }
  await getModelImages(props.modelId);
});
</script>

<style scoped>
@reference '@/theme/tailwind.css';

ion-toolbar {
  --background: linear-gradient(to right, #4f46e5, #9333ea);
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 80px;
  --padding-top: calc(var(--ion-safe-area-top, 0px) + 20px);
  --padding-bottom: 20px;
}

.swiper-slide-thumb-active {
  @apply border-tertiary/40;
  opacity: 1;
}
</style>
