import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Preferences } from "@capacitor/preferences";
import { v4 as uuidv4 } from "uuid";
import type { DisplayModelDTO } from "@/integration/dtos";
import { calculateConfigurationPrice } from "@/utils";
import type { CartItem, CartItemConfiguration } from "@/types/cart.types";
import { apiClient } from "@/integration/api";
import { Filesystem, Directory } from "@capacitor/filesystem";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  const itemsCount = computed(() => items.value.length);

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + calculateConfigurationPrice(item.configuration);
    }, 0);
  });

  async function loadCart() {
    const { value } = await Preferences.get({ key: "cart" });
    if (value) {
      items.value = JSON.parse(value);
    }
  }

  async function saveCart() {
    await Preferences.set({
      key: "cart",
      value: JSON.stringify(items.value),
    });
  }

  async function addItem(model: DisplayModelDTO, configuration: CartItemConfiguration) {
    items.value.push({
      id: uuidv4(),
      model,
      configuration,
    });
    await saveCart();
  }

  async function updateItem(id: string, configuration: CartItemConfiguration) {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.value[index].configuration = configuration;
      await saveCart();
    }
  }

  async function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id);
    await saveCart();
  }

  async function clearCart() {
    items.value = [];
    await saveCart();
  }

  async function createOrder(addressId: string) {
    const localFilePathsToDelete: string[] = [];

    // 1. Process custom items and upload local images
    const processedItems = await Promise.all(items.value.map(async (item) => {
      // Skip processing for predefined items (they don't start with 'custom-')
      if (!item.model.id.startsWith('custom-')) {
        return { model: item.model, configuration: item.configuration };
      }

      const configuration = JSON.parse(JSON.stringify(item.configuration)) as CartItemConfiguration;
      const model = JSON.parse(JSON.stringify(item.model)) as DisplayModelDTO;

      // Check if thumbnail is local
      if (model.thumbnailImageUrl?.startsWith('file://')) {
        const path = model.thumbnailImageUrl.split('/').pop()!;
        const { data: base64Data } = await Filesystem.readFile({
          path,
          directory: Directory.Data
        });
        const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
        const file = new File([blob], path, { type: blob.type });
        const { data: remoteUrl } = await apiClient.customerControllerUploadFile({ file });
        model.thumbnailImageUrl = remoteUrl;
        localFilePathsToDelete.push(path);
      }

      // Check all section images
      await Promise.all(configuration.modelImages.map(async (img) => {
        if (img.imageUrl.startsWith('file://')) {
          const path = img.imageUrl.split('/').pop()!;
          const { data: base64Data } = await Filesystem.readFile({
            path,
            directory: Directory.Data
          });
          const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
          const file = new File([blob], path, { type: blob.type });
          const { data: remoteUrl } = await apiClient.customerControllerUploadFile({ file });
          img.imageUrl = remoteUrl;
          if (!localFilePathsToDelete.includes(path)) localFilePathsToDelete.push(path);
        }
      }));

      return { model, configuration };
    }));

    // 2. Map internal cart items to backend DTO structure
    const predefinedItems = processedItems.filter(({ model }) => !model.id.startsWith('custom-'));
    const customItems = processedItems.filter(({ model }) => model.id.startsWith('custom-'));

    const payload = {
      addressId,
      items: predefinedItems.map(({ model, configuration }) => ({
        id: uuidv4(),
        price: calculateConfigurationPrice(configuration),
        englishName: model.englishName,
        arabicName: model.arabicName,
        urduName: model.urduName,
        hindiName: model.hindiName,
        bengaliName: model.bengaliName,
        imageFileId: model.thumbnailImageUrl?.split("/").pop() || "",
        sections: configuration.modelImages.flatMap((img) =>
          img.sections.map((sec) => ({
            id: uuidv4(),
            englishName: sec.englishName,
            arabicName: sec.arabicName,
            urduName: sec.urduName,
            hindiName: sec.hindiName,
            bengaliName: sec.bengaliName,
            imageFileId: img.imageUrl.split("/").pop() || "",
            coordinates: sec.coordinates,
            alterations: sec.alterations.map((alt) => ({
              id: uuidv4(),
              price: alt.price,
              englishName: alt.englishName,
              arabicName: alt.arabicName,
              urduName: alt.urduName,
              hindiName: alt.hindiName,
              bengaliName: alt.bengaliName,
              customCoordinates: [],
              informations: alt.informations.map((info) => ({
                id: uuidv4(),
                englishName: info.englishName,
                arabicName: info.arabicName,
                urduName: info.urduName,
                hindiName: info.hindiName,
                bengaliName: info.bengaliName,
                value: info.value || "",
                unit: info.unit || "",
                type: info.type || "text",
                extraDetails: info.extraDetails,
              })),
            })),
          })),
        ),
      })),
      customItems: customItems.map(({ model, configuration }) => ({
        id: uuidv4(),
        price: calculateConfigurationPrice(configuration),
        imageFileId: model.thumbnailImageUrl?.split("/").pop() || "",
        alterations: configuration.modelImages.flatMap((img) =>
          img.sections.flatMap((sec) =>
            sec.alterations.map((alt) => ({
              id: uuidv4(),
              price: alt.price,
              englishName: alt.englishName,
              arabicName: alt.arabicName,
              urduName: alt.urduName,
              hindiName: alt.hindiName,
              bengaliName: alt.bengaliName,
              customCoordinates: sec.coordinates, // Taps are points
              informations: alt.informations.map((info) => ({
                id: uuidv4(),
                englishName: info.englishName,
                arabicName: info.arabicName,
                urduName: info.urduName,
                hindiName: info.hindiName,
                bengaliName: info.bengaliName,
                value: info.value || "",
                unit: info.unit || "",
                type: info.type || "text",
                extraDetails: info.extraDetails,
              })),
            })),
          ),
        ),
      })),
    };

    const { data } = await apiClient.customerControllerCreateOrder(payload);

    // 3. Cleanup local files after successful order creation
    for (const path of localFilePathsToDelete) {
      try {
        await Filesystem.deleteFile({
          path,
          directory: Directory.Data
        });
      } catch (e) {
        console.warn("Failed to delete local file", path, e);
      }
    }

    return data;
  }

  async function confirmPayment(orderId: string, paymentId: string) {
    await apiClient.customerControllerConfirmPayment(orderId, { paymentId });
    await clearCart();
  }

  return {
    items,
    itemsCount,
    totalPrice,
    loadCart,
    saveCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    createOrder,
    confirmPayment,
  };
});
