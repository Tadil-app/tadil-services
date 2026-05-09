import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Preferences } from "@capacitor/preferences";
import { v4 as uuidv4 } from "uuid";
import type { DisplayModelDTO } from "@/integration/dtos";
import { calculateConfigurationPrice } from "@/utils";
import type { CartItem, CartItemConfiguration } from "@/types/cart.types";
import { apiClient } from "@/integration/api";

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
    // Map internal cart items to backend DTO structure
    const payload = {
      addressId,
      items: items.value.map(item => ({
        id: uuidv4(),
        price: calculateConfigurationPrice(item.configuration),
        modelId: item.model.id,
        sections: item.configuration.modelImages.flatMap(img => 
          img.sections.map(sec => ({
            id: uuidv4(),
            sourceSectionId: sec.sectionId,
            englishName: sec.englishName,
            arabicName: sec.arabicName,
            urduName: sec.urduName,
            hindiName: sec.hindiName,
            bengaliName: sec.bengaliName,
            alterations: sec.alterations.map(alt => ({
              id: uuidv4(),
              sourceAlterationId: alt.alterationId,
              price: alt.price,
              englishName: alt.englishName,
              arabicName: alt.arabicName,
              urduName: alt.urduName,
              hindiName: alt.hindiName,
              bengaliName: alt.bengaliName,
              informations: alt.informations.map(info => ({
                id: uuidv4(),
                sourceInformationId: info.informationId,
                englishName: info.englishName,
                arabicName: info.arabicName,
                urduName: info.urduName,
                hindiName: info.hindiName,
                bengaliName: info.bengaliName,
                value: info.value || '',
                unit: info.unit || '',
                type: 'text' // Fallback
              }))
            }))
          }))
        )
      })),
      customItems: [] // Handle custom items later if needed
    };

    const { data } = await apiClient.customerControllerCreateOrder(payload);
    return data;
  }

  async function confirmPayment(orderId: string, paymentId: string) {
    await apiClient.customerControllerConfirmPayment(orderId, paymentId);
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
