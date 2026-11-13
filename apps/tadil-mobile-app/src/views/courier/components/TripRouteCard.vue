<template>
  <IonCard class="ion-padding space-y-4">
    <!-- Trip direction -->
    <div
      class="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold"
      data-testid="trip-direction"
    >
      <component :is="trip.direction === 'toTailor' ? User : Scissors" class="w-5 h-5 shrink-0" />
      <span>{{ $t(`courier.trip.${trip.direction}`) }}</span>
      <ArrowRight class="w-4 h-4 shrink-0 rtl:rotate-180" />
      <component :is="trip.direction === 'toTailor' ? Scissors : User" class="w-5 h-5 shrink-0" />
    </div>

    <!-- Pickup and delivery points -->
    <div class="relative">
      <div
        class="absolute top-6 bottom-6 start-[15px] border-s-2 border-dashed border-primary/30"
        aria-hidden="true"
      />
      <div
        v-for="stop in stops"
        :key="stop.kind"
        class="relative flex gap-3 py-2"
        :data-testid="`trip-stop-${stop.kind}`"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
          :class="stop.isNext ? 'bg-primary text-white' : 'bg-item border-2 border-primary/30 text-primary'"
        >
          <component :is="stop.kind === 'pickup' ? Package : Flag" class="w-4 h-4" />
        </div>

        <div
          class="flex-1 min-w-0 rounded-2xl p-3 border"
          :class="stop.isNext ? 'border-primary bg-primary/5' : 'border-border'"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-medium">
              {{ $t(stop.kind === "pickup" ? "courier.trip.pickupPoint" : "courier.trip.dropoffPoint") }}
            </p>
            <span
              v-if="stop.isNext"
              class="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase"
            >
              {{ $t("courier.trip.nextStop") }}
            </span>
          </div>

          <p class="mt-1 font-bold flex items-center gap-1">
            <component :is="stop.role === 'customer' ? User : Scissors" class="w-4 h-4 text-primary shrink-0" />
            <span>{{ $t(`courier.trip.${stop.role}`) }}</span>
            <span v-if="stop.name" class="font-normal truncate">· {{ stop.name }}</span>
          </p>

          <div v-if="stop.address" class="mt-1 text-sm">
            <p class="font-medium">{{ cityName(stop.address) }}</p>
            <p class="text-medium">
              {{ [districtName(stop.address), streetName(stop.address)].filter(Boolean).join(" · ") }}
            </p>
          </div>
          <p v-else class="mt-1 text-sm text-medium italic">{{ $t("courier.trip.noLocation") }}</p>

          <IonButton
            v-if="showNavigation"
            class="mt-3"
            expand="block"
            size="small"
            :fill="stop.isNext ? 'solid' : 'outline'"
            :disabled="!canNavigate(stop.address)"
            @click="navigateTo(stop.address)"
          >
            <Navigation class="w-4 h-4 me-2" />
            {{ $t("courier.trip.navigate") }}
          </IonButton>
        </div>
      </div>
    </div>
  </IonCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonButton, IonCard } from "@ionic/vue";
import { ArrowRight, Flag, Navigation, Package, Scissors, User } from "lucide-vue-next";
import { CourierTrip } from "@/utils";
import { useLocalizedAddress, useTripNavigation } from "@/composables";

const props = defineProps<{
  trip: CourierTrip;
}>();

const { cityName, districtName, streetName } = useLocalizedAddress();
const { navigateTo, canNavigate } = useTripNavigation();

// Navigation stays useful until the parcel is delivered.
const showNavigation = computed(() => props.trip.stage !== "completed");

const stops = computed(() => [
  { kind: "pickup" as const, ...props.trip.pickup, isNext: props.trip.nextStop === props.trip.pickup },
  { kind: "dropoff" as const, ...props.trip.dropoff, isNext: props.trip.nextStop === props.trip.dropoff },
]);
</script>
