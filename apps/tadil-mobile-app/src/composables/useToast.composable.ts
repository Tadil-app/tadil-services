import { toastController } from "@ionic/vue";
import { type ToastOptions } from "@ionic/core";
import { ref } from "vue";

export function useToast() {
  const toast = ref<HTMLIonToastElement>();
  async function showToast(options: ToastOptions) {
    toast.value = await toastController.create({
      duration: 3000,
      color: "secondary",
      position: "bottom",
      ...options,
    });

    await toast.value.present();
  }

  async function dismissToast() {
    if (toast.value) {
      await toast.value.dismiss();
    }
  }
  return { showToast, dismissToast };
}
