import { useAuthStore } from "@/stores";
import { alertController, modalController, useIonRouter } from "@ionic/vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

type PromptAuthOptions = {
  beforeNavigate?: () => void;
};

export function useRequireAuth() {
  const authStore = useAuthStore();
  const ionRouter = useIonRouter();
  const route = useRoute();
  const { t } = useI18n();

  async function dismissOverlays() {
    try {
      await alertController.dismiss();
    } catch {
      // No active alert.
    }

    while (true) {
      try {
        const dismissed = await modalController.dismiss();
        if (!dismissed) break;
      } catch {
        break;
      }
    }
  }

  async function goToLogin(
    redirectPath?: string,
    options?: PromptAuthOptions,
  ) {
    const redirect = redirectPath ?? route.fullPath;
    options?.beforeNavigate?.();
    await dismissOverlays();
    ionRouter.navigate(
      `/login?redirect=${encodeURIComponent(redirect)}`,
      "root",
      "replace",
    );
  }

  function requireAuth(redirectPath?: string): boolean {
    if (authStore.token) return true;
    void goToLogin(redirectPath);
    return false;
  }

  async function promptAuth(
    redirectPath?: string,
    options?: PromptAuthOptions,
  ): Promise<boolean> {
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

    if (role === "confirm") {
      await goToLogin(redirectPath, options);
    }

    return false;
  }

  return { requireAuth, promptAuth };
}
