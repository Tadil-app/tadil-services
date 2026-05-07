import { useToast } from "@/composables";
import { apiClient } from "@/integration/api";
import { DisplayAlterationDTO, Point } from "@/integration/dtos";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { calculateConfigurationPrice } from "@/utils";
import type { SelectedAlteration } from "@/types/cart.types";

export interface CustomPinpoint {
  id: string;
  coordinates: Point;
  alterations: SelectedAlteration[];
}

const customImageUrl = ref<string>();
const uploadedImageUrl = ref<string>();
const selectedCategory = ref<string>();
const pinpoints = ref<CustomPinpoint[]>([]);
const availableAlterations = ref<DisplayAlterationDTO[]>([]);

export function useCustomModel() {
  const { showToast } = useToast();
  const { t } = useI18n();
  const isLoading = ref(false);

  const totalAlterationsCount = computed(() => {
    return pinpoints.value.reduce((acc, p) => acc + p.alterations.length, 0);
  });

  const totalPrice = computed(() => {
    return calculateConfigurationPrice({
      modelId: "temp",
      modelImages: [
        {
          modelImageId: "temp",
          imageUrl: "",
          sections: pinpoints.value.map((p) => ({
            sectionId: p.id,
            englishName: "",
            arabicName: "",
            hindiName: "",
            urduName: "",
            bengaliName: "",
            coordinates: [p.coordinates],
            alterations: p.alterations,
          })),
        },
      ],
    });
  });

  const hasUnsavedChanges = computed(
    () => pinpoints.value.length > 0 || !!customImageUrl.value,
  );

  async function getAlterations() {
    try {
      const { data } = await apiClient.customerControllerGetAlterations();
      availableAlterations.value = data;
    } catch (error) {
      showToast({ message: t("common.errors.loadAlterations"), color: "danger" });
    }
  }

  async function uploadImage(file: File) {
    isLoading.value = true;
    try {
      const { data } = await apiClient.customerControllerUploadFile({ file });
      uploadedImageUrl.value = data;
      return data;
    } catch (error) {
      showToast({ message: t("common.errors.uploadImage"), color: "danger" });
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function addAlterationToPinpoint(
    pinpointId: string,
    alteration: SelectedAlteration,
  ) {
    const pinpoint = pinpoints.value.find((p) => p.id === pinpointId);
    if (pinpoint) {
      pinpoint.alterations.push(alteration);
    }
  }

  function createPinpointWithAlteration(
    coordinates: Point,
    alteration: SelectedAlteration,
  ) {
    pinpoints.value.push({
      id: crypto.randomUUID(),
      coordinates,
      alterations: [alteration],
    });
  }

  function removeAlteration(pinpointId: string, alterationId: string) {
    const pinpoint = pinpoints.value.find((p) => p.id === pinpointId);
    if (pinpoint) {
      pinpoint.alterations = pinpoint.alterations.filter(
        (a) => a.alterationId !== alterationId,
      );
      if (pinpoint.alterations.length === 0) {
        pinpoints.value = pinpoints.value.filter((p) => p.id !== pinpointId);
      }
    }
  }

  function removePinpoint(id: string) {
    pinpoints.value = pinpoints.value.filter((p) => p.id !== id);
  }

  function getPinpointNames(index: number) {
    const pointNum = index + 1;
    return {
      englishName: `Point ${pointNum}`,
      arabicName: `نقطة ${pointNum}`,
      hindiName: `बिंदु ${pointNum}`,
      urduName: `نکتہ ${pointNum}`,
      bengaliName: `পয়েন্ট ${pointNum}`,
    };
  }

  function reset() {
    customImageUrl.value = undefined;
    uploadedImageUrl.value = undefined;
    selectedCategory.value = undefined;
    pinpoints.value = [];
    availableAlterations.value = [];
  }

  return {
    customImageUrl,
    uploadedImageUrl,
    selectedCategory,
    pinpoints,
    availableAlterations,
    isLoading,
    totalAlterationsCount,
    totalPrice,
    hasUnsavedChanges,
    getAlterations,
    uploadImage,
    addAlterationToPinpoint,
    createPinpointWithAlteration,
    removeAlteration,
    removePinpoint,
    getPinpointNames,
    reset,
  };
}
