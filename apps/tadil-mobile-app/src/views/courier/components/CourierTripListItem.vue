<template>
  <div
    class="p-4 rounded-2xl bg-item text-main border border-border shadow-sm active:bg-step-100 transition-colors cursor-pointer space-y-3"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-bold text-lg truncate">#{{ order.reference }}</p>
        <p class="text-xs text-medium">{{ formatDate(order.date) }}</p>
      </div>
      <StatusPill :status="order.status" />
    </div>

    <p class="text-sm font-bold text-primary flex items-center gap-1">
      <ArrowRight class="w-4 h-4 shrink-0 rtl:rotate-180" />
      {{ $t(`courier.trip.${trip.direction}`) }}
    </p>

    <div class="flex items-center gap-3">
      <div class="flex-1 min-w-0 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
        <Package class="w-4 h-4 text-primary mt-0.5" />
        <p class="truncate">
          <span class="text-medium">{{ $t("courier.trip.pickupPoint") }}:</span>
          {{ placeName(trip.pickup.address) }}
        </p>
        <Flag class="w-4 h-4 text-primary mt-0.5" />
        <p class="truncate">
          <span class="text-medium">{{ $t("courier.trip.dropoffPoint") }}:</span>
          {{ placeName(trip.dropoff.address) }}
        </p>
      </div>

      <IonButton
        v-if="trip.nextStop"
        shape="round"
        size="small"
        :disabled="!canNavigate(trip.nextStop.address)"
        :aria-label="$t('courier.trip.navigate')"
        @click.stop="navigateTo(trip.nextStop.address)"
      >
        <Navigation class="w-4 h-4" />
      </IonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonButton } from "@ionic/vue";
import { useI18n } from "vue-i18n";
import { ArrowRight, Flag, Navigation, Package } from "lucide-vue-next";
import { StatusPill } from "@/components";
import { DisplayAddressDto, DisplayOrderDTO } from "@/integration/dtos";
import { formatDate, getCourierTrip } from "@/utils";
import { useLocalizedAddress, useTripNavigation } from "@/composables";
import { useAuthStore } from "@/stores";

const props = defineProps<{
  order: DisplayOrderDTO;
}>();

const { t } = useI18n();
const authStore = useAuthStore();
const { cityName, districtName } = useLocalizedAddress();
const { navigateTo, canNavigate } = useTripNavigation();

const trip = computed(() => getCourierTrip(props.order, authStore.userId));

/** Short place name for the list: district, or the city when there is none. */
function placeName(address: DisplayAddressDto | null): string {
  if (!address) return t("courier.trip.noLocation");
  return districtName(address) || cityName(address);
}
</script>
