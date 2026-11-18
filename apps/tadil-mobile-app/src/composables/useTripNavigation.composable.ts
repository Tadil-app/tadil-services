import { actionSheetController } from "@ionic/vue";
import { Capacitor } from "@capacitor/core";
import { useI18n } from "vue-i18n";
import { DisplayAddressDto } from "@/integration/dtos";
import { buildNavigationUrl, canNavigateTo, MapsApp, NavigationTarget, openExternalUrl } from "@/utils";
import { useLocalizedAddress } from "./useLocalizedAddress.composable";
import { useToast } from "./useToast.composable";

/**
 * Opens turn-by-turn driving directions to an address in the maps app the
 * driver picks. Apple Maps is only offered on iPhone.
 */
export function useTripNavigation() {
  const { t, locale } = useI18n();
  const { showToast } = useToast();
  const { cityName, districtName, streetName } = useLocalizedAddress();

  /** One line of readable address: street, district, city. */
  function formatAddress(address?: DisplayAddressDto | null): string {
    if (!address) return "";
    return [streetName(address), districtName(address), cityName(address)]
      .filter((part) => !!part)
      .join(["ar", "ur"].includes(String(locale.value)) ? "، " : ", ");
  }

  function toTarget(address?: DisplayAddressDto | null): NavigationTarget {
    return {
      latitude: address?.latitude,
      longitude: address?.longitude,
      query: formatAddress(address),
    };
  }

  function canNavigate(address?: DisplayAddressDto | null): boolean {
    return !!address && canNavigateTo(toTarget(address));
  }

  async function openUrl(url: string) {
    // The phone opens the maps app, or its website when it is not installed.
    const opened = await openExternalUrl(url);
    if (!opened) {
      showToast({ message: t("courier.trip.openFailed"), color: "danger" });
    }
  }

  async function navigateTo(address?: DisplayAddressDto | null) {
    const target = toTarget(address);
    if (!address || !canNavigateTo(target)) {
      showToast({ message: t("courier.trip.noLocation"), color: "danger" });
      return;
    }

    const apps: { app: MapsApp; text: string }[] = [
      { app: "google", text: t("courier.trip.googleMaps") },
      { app: "waze", text: t("courier.trip.waze") },
    ];
    if (Capacitor.getPlatform() === "ios") {
      apps.push({ app: "apple", text: t("courier.trip.appleMaps") });
    }

    const sheet = await actionSheetController.create({
      header: t("courier.trip.openWith"),
      buttons: [
        ...apps.map(({ app, text }) => ({
          text,
          handler: () => {
            const url = buildNavigationUrl(app, target);
            if (url) openUrl(url);
          },
        })),
        { text: t("common.buttons.cancel"), role: "cancel" },
      ],
    });
    await sheet.present();
  }

  return { navigateTo, canNavigate, formatAddress };
}
