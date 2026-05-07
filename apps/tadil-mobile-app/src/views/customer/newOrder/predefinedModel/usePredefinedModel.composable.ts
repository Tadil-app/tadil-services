import { useToast } from "@/composables";
import { apiClient } from "@/integration/api";
import {
  DisplayAlterationDTO,
  DisplayModelDTO,
  DisplayModelImageDTO,
  DisplaySectionDTO,
  ModelCategory,
  Point,
} from "@/integration/dtos";
import { alertController } from "@ionic/vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { calculateConfigurationPrice } from "@/utils";
import type {
  SelectedAlteration,
  SelectedSection,
  SelectedImage,
  ModelItems,
} from "@/types/cart.types";

const models = ref<DisplayModelDTO[]>([]);
const selectedModel = ref<DisplayModelDTO>();
const modelImages = ref<DisplayModelImageDTO[]>([]);
const selectedImage = ref<DisplayModelImageDTO>();
const selectedSection = ref<DisplaySectionDTO>();
const alterations = ref<DisplayAlterationDTO[]>([]);
const modelItems = ref<ModelItems>();
const editingAlterationId = ref<string>();

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  const x = point.x;
  const y = point.y;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const polygonI = polygon[i];
    const polygonJ = polygon[j];
    if (!polygonI || !polygonJ) continue;

    const xi = polygonI.x;
    const yi = polygonI.y;
    const xj = polygonJ.x;
    const yj = polygonJ.y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

export function usePredefinedModel() {
  const { showToast, dismissToast } = useToast();
  const { t } = useI18n();
  const isLoadingModels = ref<boolean>(false);

  // --- Computed ---
  const filteredAlterations = computed(() => {
    if (!selectedSection.value || !selectedImage.value)
      return alterations.value;

    const existingSection = modelItems.value?.modelImages
      .find((img) => img.modelImageId === selectedImage.value!.id)
      ?.sections.find((s) => s.sectionId === selectedSection.value!.id);

    const existingIds =
      existingSection?.alterations
        .map((a) => a.alterationId)
        .filter((id) => id !== editingAlterationId.value) || [];

    return alterations.value.filter((alt) => !existingIds.includes(alt.id));
  });

  const totalAlterationsCount = computed(() => {
    if (!modelItems.value) return 0;

    return modelItems.value.modelImages.reduce((imageAcc, image) => {
      const imageCount = image.sections.reduce((sectionAcc, section) => {
        return sectionAcc + section.alterations.length;
      }, 0);
      return imageAcc + imageCount;
    }, 0);
  });

  const totalPrice = computed(() => {
    if (!modelItems.value) return 0;
    return calculateConfigurationPrice(modelItems.value);
  });

  const hasUnsavedChanges = computed(() => {
    return (
      (modelItems.value?.modelImages.length || 0) > 0 &&
      totalAlterationsCount.value > 0
    );
  });

  // --- Internal Helpers ---
  const getOrInitImageEntry = (imageId: string, imageUrl: string): SelectedImage => {
    if (!modelItems.value) {
      modelItems.value = { modelId: selectedModel.value!.id, modelImages: [] };
    }
    let img = modelItems.value.modelImages.find(
      (i) => i.modelImageId === imageId,
    );
    if (!img) {
      img = { modelImageId: imageId, imageUrl, sections: [] };
      modelItems.value.modelImages.push(img);
    }
    return img;
  };

  const getOrInitSectionEntry = (
    imageEntry: SelectedImage,
    section: DisplaySectionDTO,
  ): SelectedSection => {
    let sectionEntry = imageEntry.sections.find((s) => s.sectionId === section.id);
    if (!sectionEntry) {
      sectionEntry = {
        sectionId: section.id,
        englishName: section.englishName,
        arabicName: section.arabicName,
        hindiName: section.hindiName,
        urduName: section.urduName,
        bengaliName: section.bengaliName,
        coordinates: section.coordinates,
        alterations: [],
      };
      imageEntry.sections.push(sectionEntry);
    }
    return sectionEntry;
  };

  // --- Actions ---
  async function getModels(category: ModelCategory) {
    isLoadingModels.value = true;
    dismissToast();
    try {
      const { data } = await apiClient.customerControllerGetModels({
        category,
      });
      models.value = data;
    } catch (error) {
      showToast({ message: t("common.errors.loadModels"), color: "danger" });
    } finally {
      isLoadingModels.value = false;
    }
  }

  async function getModelImages(modelId: string) {
    try {
      const { data } = await apiClient.customerControllerGetModelImages(modelId);
      modelImages.value = data;
      if (data.length > 0) selectedImage.value = data[0];
    } catch (error) {
      showToast({ message: t("common.errors.loadImages"), color: "danger" });
    }
  }

  async function getAlterations(sectionId?: string) {
    const targetId = sectionId || selectedSection.value?.id;
    if (!targetId) return;
    try {
      const { data } = await apiClient.customerControllerGetAlterations({
        sectionId: targetId,
      });
      alterations.value = data;
    } catch (error) {
      showToast({ message: t("common.errors.loadAlterations"), color: "danger" });
    }
  }

  async function selectSection(section: DisplaySectionDTO) {
    const currentImgEntry = modelItems.value?.modelImages.find(
      (i) => i.modelImageId === selectedImage.value?.id,
    );
    const existing = currentImgEntry?.sections.find(
      (s) => s.sectionId === section.id,
    );

    if (existing) {
      const alert = await alertController.create({
        header: t("common.alerts.zoneOptions.header"),
        subHeader: `${existing.alterations.length} ${t("cart.alterations")}`,
        cssClass: "section-alert",
        buttons: [
          {
            text: t("common.alerts.zoneOptions.addNew"),
            cssClass: "btn-add",
            handler: async () => {
              selectedSection.value = section;
              await getAlterations(section.id);
            },
          },
          {
            text: t("common.alerts.zoneOptions.removeAll"),
            cssClass: "btn-remove",
            handler: () => {
              if (currentImgEntry) {
                const idx = currentImgEntry.sections.findIndex(
                  (s) => s.sectionId === section.id,
                );
                if (idx !== -1) currentImgEntry.sections.splice(idx, 1);
              }
              selectedSection.value = undefined;
            },
          },
          { text: t("common.buttons.cancel"), role: "cancel", cssClass: "btn-cancel" },
        ],
      });
      return await alert.present();
    }

    selectedSection.value = section;
    await getAlterations(section.id);
  }

  function findSectionAtPoint(point: Point) {
    if (!selectedImage.value) return;

    for (const section of selectedImage.value.sections) {
      if (isPointInPolygon(point, section.coordinates)) {
        selectSection(section);
        return;
      }
    }
  }

  function addAlteration(alterationData: SelectedAlteration) {
    if (!selectedImage.value || !selectedSection.value) return;

    const imgEntry = getOrInitImageEntry(selectedImage.value.id, selectedImage.value.imageUrl);
    const sectionEntry = getOrInitSectionEntry(
      imgEntry,
      selectedSection.value,
    );

    sectionEntry.alterations.push(alterationData);
    selectedSection.value = undefined;
    editingAlterationId.value = undefined;
  }

  function removeAlteration(
    imageId: string,
    sectionId: string,
    alterationId: string,
  ) {
    if (!modelItems.value) return;

    const imageEntry = modelItems.value.modelImages.find(
      (i) => i.modelImageId === imageId,
    );

    const sectionEntry = imageEntry?.sections.find(
      (s) => s.sectionId === sectionId,
    );

    if (sectionEntry) {
      const index = sectionEntry.alterations.findIndex(
        (a) => a.alterationId === alterationId,
      );

      if (index !== -1) {
        sectionEntry.alterations.splice(index, 1);
      }

      if (sectionEntry.alterations.length === 0) {
        imageEntry!.sections = imageEntry!.sections.filter(
          (s) => s.sectionId !== sectionId,
        );
      }
    }
  }

  function resetSelection() {
    selectedModel.value = undefined;
    modelImages.value = [];
    selectedImage.value = undefined;
    selectedSection.value = undefined;
    alterations.value = [];
    modelItems.value = undefined;
    editingAlterationId.value = undefined;
  }

  return {
    isLoadingModels,
    models,
    selectedModel,
    getModels,
    modelImages,
    selectedImage,
    getModelImages,
    selectedSection,
    selectSection,
    findSectionAtPoint,
    alterations,
    filteredAlterations,
    getAlterations,
    modelItems,
    totalAlterationsCount,
    totalPrice,
    hasUnsavedChanges,
    addAlteration,
    removeAlteration,
    resetSelection,
    editingAlterationId,
  };
}
