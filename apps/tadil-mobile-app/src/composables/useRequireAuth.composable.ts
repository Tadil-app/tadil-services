import { useAuthStore } from "@/stores";
import { alertController } from "@ionic/vue";
import { useI18n } from "vue-i18n";

export function useRequireAuth() {
  const authStore = useAuthStore();
  const { t } = useI18n();

  async function confirmLogin(): Promise<boolean> {
    if (authStore.token) return true;

    const alert = await alertController.create({
      header: t("common.alerts.loginRequired.header"),
      message: t("common.alerts.loginRequired.message"),
      cssClass: "section-alert",
      buttons: [
        {
          text: t("common.buttons.cancel"),
          role: "cancel",
          cssClass: "btn-cancel",
        },
        {
          text: t("login.form.buttons.login"),
          role: "confirm",
          cssClass: "btn-add",
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === "confirm";
  }

  return { confirmLogin };
}
