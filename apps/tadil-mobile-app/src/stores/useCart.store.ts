import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Preferences } from "@capacitor/preferences";
import { v4 as uuidv4 } from "uuid";
import type { DisplayModelDTO } from "@/integration/dtos";
import { calculateConfigurationPrice } from "@/utils";
import type { CartItem, CartItemConfiguration } from "@/types/cart.types";

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
  };
});
