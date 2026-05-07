import { ref, type Ref } from "vue";

export function usePrices(entity: Ref<{ price: number }>) {
  const priceValidationError = ref<string>("");

  function validatePrice() {
    if (!entity.value.price || entity.value.price <= 0) {
      priceValidationError.value = "common.inputs.price.errorMessage";
      return false;
    }
    priceValidationError.value = "";
    return true;
  }

  function resetPriceValidation() {
    priceValidationError.value = "";
  }

  return {
    priceValidationError,
    validatePrice,
    resetPriceValidation,
  };
}
