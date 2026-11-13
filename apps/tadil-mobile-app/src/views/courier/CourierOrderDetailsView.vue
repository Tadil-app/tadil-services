<template>
  <IonPage>
    <SecondaryHeader
      :title="order ? '#' + order.reference : $t('tailor.orderDetails.title')"
      default-href="/courier/orders"
    />
    <IonContent class="ion-padding space-y-6">
      <div v-if="isLoading" class="flex justify-center py-10">
        <IonSpinner name="crescent" />
      </div>
      <template v-else-if="order">
        <IonCard class="ion-padding">
          <div class="flex justify-between">
            <div>
              <p class="font-light">{{ $t("tailor.orderDetails.referenceLabel") }}</p>
              <p class="font-semibold text-lg">#{{ order.reference }}</p>
              <p class="mt-4 font-light">{{ $t("tailor.orderDetails.customerName") }}</p>
              <p class="font-semibold">{{ order.customerName }}</p>
              <p class="mt-4 font-light">{{ formatDate(order.date) }}</p>
              <p class="text-lg text-secondary font-semibold">
                {{ $t("common.currencies.sar") }} {{ order.totalPrice }}
              </p>
            </div>
            <div class="flex flex-col justify-between items-end">
              <IonButton fill="clear" @click="printLabel" class="ion-hide-print text-primary m-0 p-0 h-10">
                <Printer class="w-8 h-8" />
              </IonButton>
              <StatusPill :status="order.status" />
            </div>
          </div>
        </IonCard>

        <!-- Trip: direction, pickup and delivery points, navigation -->
        <TripRouteCard v-if="trip" :trip="trip" />

        <OrderTimeline v-if="order.history && order.history.length > 0" :history="order.history" />

        <!-- Order Items -->
        <IonCard color="transparent" class="ion-padding">
          <p class="mb-4 font-bold">{{ $t("tailor.orderDetails.alterations.title") }}</p>
          <IonCard v-for="item in order.items" :key="item.id" class="m-0 mb-4 overflow-hidden">
            <ModelSegmenter
              :image-url="item.imageFileUrl"
              :sections="item.sections.map((section) => section.coordinates)"
              fit="contain"
            />
            <div class="divide-y divide-border space-y-2 p-2">
              <div v-for="section in item.sections" :key="section.id" class="py-2">
                <TranslatedName :names="section" class="text-lg font-semibold" />
                <div v-for="alteration in section.alterations" :key="alteration.id" class="px-4">
                  <TranslatedName :names="alteration" class="font-semibold" />
                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="information in alteration.informations" :key="information.id" class="col-span-1 px-4 py-2 bg-gray-100 rounded-lg">
                      <TranslatedName :names="information" />
                      <TranslatedName v-if="information.extraDetails" :names="information.extraDetails" />
                      <p v-else>{{ information.value }} {{ information.unit ? $t("common.units." + information.unit) : "" }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </IonCard>
          
          <IonCard v-for="item in order.customItems" :key="item.id" class="m-0 mb-4 overflow-hidden space-y-2">
            <ModelSegmenter
              :image-url="item.imageFileUrl"
              :sections="[]"
              :points="item.alterations.flatMap((alteration) => alteration.customCoordinates)"
              fit="contain"
            />
            <div v-for="(alteration, index) in item.alterations" :key="alteration.id" class="px-4 py-2">
              <p class="font-semibold">{{ $t("customModel.point", { number: index + 1 }) }}</p>
              <TranslatedName :names="alteration" class="font-semibold" />
              <div class="grid grid-cols-2 gap-4">
                <div v-for="information in alteration.informations" :key="information.id" class="px-4 py-2 bg-gray-100 rounded-lg">
                  <TranslatedName :names="information" />
                  <TranslatedName v-if="information.extraDetails" :names="information.extraDetails" class="truncate" />
                  <p v-else class="truncate">{{ information.value }} {{ information.unit ? $t("common.units." + information.unit) : "" }}</p>
                </div>
              </div>
            </div>
          </IonCard>
        </IonCard>

        <!-- Chats open once this driver takes the trip -->
        <OrderChats v-if="order && isMyTrip" :order-id="order.id" :channels="chatChannels" />

        <!-- Action Buttons -->
        <div class="space-y-3 pb-10">
          <div v-if="isPendingAssignment" class="grid grid-cols-2 gap-4">
            <IonButton expand="block" color="danger" fill="outline" @click="handleDecline" :disabled="isActionLoading">
              {{ $t("tailor.orderDetails.declineOrder.buttonText") }}
            </IonButton>
            <IonButton expand="block" color="success" @click="handleAccept" :disabled="isActionLoading">
              {{ $t("tailor.orderDetails.acceptOrder.buttonText") }}
            </IonButton>
          </div>

          <IonButton
            v-if="canConfirmPickup"
            expand="block"
            color="primary"
            @click="handlePickup"
            :disabled="isActionLoading"
          >
            <IonSpinner v-if="isActionLoading" name="crescent" />
            <span v-else>
              {{ isReturnTrip ? $t("courier.orderDetails.confirmPickupFromTailor") : $t("courier.orderDetails.confirmPickupFromCustomer") }}
            </span>
          </IonButton>

          <IonButton
            v-if="canMarkDelivered"
            expand="block"
            color="success"
            @click="handleDeliver"
            :disabled="isActionLoading"
          >
            <IonSpinner v-if="isActionLoading" name="crescent" />
            <span v-else>
              {{ isReturnTrip ? $t("courier.orderDetails.deliverToCustomer") : $t("courier.orderDetails.deliverToTailor") }}
            </span>
          </IonButton>
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Printer } from "lucide-vue-next";
import { DisplayOrderDTO, ORDER_STATUS, ShippingLabelDTO } from "@/integration/dtos";
import { createTailorOrderDeepLink, formatDate, getCourierTrip } from "@/utils";
import QRCode from "qrcode";
import { useToast, ChatChannel } from "@/composables";
import { apiClient } from "@/integration/api";
import { useAuthStore } from "@/stores";
import { ModelSegmenter, TranslatedName, StatusPill, SecondaryHeader, OrderTimeline, OrderChats } from "@/components";
import { useI18n } from "vue-i18n";
import { IonButton, IonCard, IonContent, IonPage, IonSpinner } from "@ionic/vue";
import { getOrderLableHtml } from "./orderPritnable";
import TripRouteCard from "./components/TripRouteCard.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const order = ref<DisplayOrderDTO>();
const isLoading = ref(true);
const isActionLoading = ref(false);

const orderId = computed(() => route.params.id as string);

const isMyTrip = computed(
  () =>
    !!authStore.userId &&
    (order.value?.assignedCourierId === authStore.userId ||
      order.value?.assignedReturnCourierId === authStore.userId),
);

const chatChannels = computed(() => {
  const channels: { channel: ChatChannel; label: string }[] = [
    { channel: "COURIER", label: t("chat.channels.customer") },
  ];
  if (order.value?.assignedTailorId) {
    channels.push({ channel: "TAILOR_COURIER", label: t("chat.channels.tailor") });
  }
  return channels;
});

const trip = computed(() => (order.value ? getCourierTrip(order.value, authStore.userId) : null));

const isPendingAssignment = computed(() => 
  order.value?.status === ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT || 
  order.value?.status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT
);

const canConfirmPickup = computed(() => 
  order.value?.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER ||
  order.value?.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR
);

const canMarkDelivered = computed(() => 
  order.value?.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR ||
  order.value?.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER
);

const isReturnTrip = computed(() => 
  order.value?.status === ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT ||
  order.value?.status === ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR ||
  order.value?.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER
);

async function fetchOrder() {
  if (!authStore.userId) return;
  isLoading.value = true;
  try {
    const { data } = await apiClient.courierControllerGetOrders(authStore.userId);
    order.value = data.find((o: DisplayOrderDTO) => o.id === orderId.value || o.reference === orderId.value);
  } catch (error) {
    console.error("Failed to fetch order", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleAccept() {
  if (!order.value) return;
  await performAction(() => 
    apiClient.courierControllerAccept(authStore.userId, order.value!.id, { isReturn: String(isReturnTrip.value) })
  );
}

async function handleDecline() {
  if (!order.value) return;
  await performAction(() => 
    apiClient.courierControllerDecline(authStore.userId, order.value!.id, { isReturn: String(isReturnTrip.value) })
  );
  router.push('/courier/orders');
}

async function handlePickup() {
  if (!order.value) return;
  await performAction(() => 
    apiClient.courierControllerPickup(authStore.userId, order.value!.id)
  );
}

async function handleDeliver() {
  if (!order.value) return;
  await performAction(() => 
    apiClient.courierControllerDeliver(authStore.userId, order.value!.id)
  );
}

async function performAction(action: () => Promise<any>) {
  isActionLoading.value = true;
  try {
    await action();
    await fetchOrder();
    showToast({ message: t("common.messages.actionSuccess") });
  } catch (error) {
    console.error("Action failed", error);
    showToast({ message: t("common.messages.actionError"), color: "danger" });
  } finally {
    isActionLoading.value = false;
  }
}

async function printLabel() {
  if (!order.value) return;
  try {
    const { data: label } = await apiClient.courierControllerGetShippingLabel(
      authStore.userId,
      order.value.id
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast({ message: "Please allow popups to print the label.", color: "danger" });
      return;
    }

    const qrCodeDataUrl = await QRCode.toDataURL(
      createTailorOrderDeepLink(label.orderReference),
      { errorCorrectionLevel: "H", margin: 1, width: 240 }
    );
    const html = getOrderLableHtml(label, t, qrCodeDataUrl);

    printWindow.document.write(html);
    printWindow.document.close();
  } catch (error) {
    console.error("Failed to generate shipping label", error);
    showToast({ message: "Failed to load printable shipping label.", color: "danger" });
  }
}

onMounted(fetchOrder);
</script>
