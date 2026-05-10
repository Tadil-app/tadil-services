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
              <p class="mt-4 font-light">{{ formatDate(order.date) }}</p>
              <p class="text-lg text-secondary font-semibold">
                {{ $t("common.currencies.sar") }} {{ order.totalPrice }}
              </p>
            </div>
            <div class="flex flex-col justify-between items-end">
              <QrcodeSvg
                :value="order.reference"
                :size="80"
                level="H"
                class="border border-black p-1 rounded-lg"
              />
              <StatusPill :status="order.status" />
            </div>
          </div>
        </IonCard>

        <OrderTimeline v-if="order.history && order.history.length > 0" :history="order.history" />

        <!-- Address Info -->
        <IonCard class="ion-padding space-y-2">
          <h3 class="font-bold flex items-center gap-2">
            <MapPin class="w-4 h-4 text-primary" />
            {{ $t("courier.orderDetails.deliveryAddress") }}
          </h3>
          <div v-if="order.address" class="text-sm">
            <p class="font-medium">{{ order.address.city }}</p>
            <p class="text-muted-foreground">{{ order.address.district }} {{ order.address.street }}</p>
          </div>
          <p v-else class="text-sm text-muted-foreground italic">{{ $t("common.noAddress") }}</p>
        </IonCard>

        <!-- Order Items -->
        <IonCard color="transparent" class="ion-padding">
          <p class="mb-4 font-bold">{{ $t("tailor.orderDetails.alterations.title") }}</p>
          <IonCard v-for="item in order.items" :key="item.id" class="m-0 mb-4 overflow-hidden">
            <ImageContainer :imageUrl="item.imageFileUrl" class="max-h-40" />
            <div class="divide-y divide-border space-y-2 p-2">
              <div v-for="section in item.sections" :key="section.id" class="py-2">
                <TranslatedName :names="section" class="text-lg font-semibold" />
                <div v-for="alteration in section.alterations" :key="alteration.id" class="px-4">
                  <TranslatedName :names="alteration" class="font-semibold" />
                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="information in alteration.informations" :key="information.id" class="col-span-1 px-4 py-2 bg-gray-100 rounded-lg">
                      <TranslatedName :names="information" />
                      <p>{{ information.value }} {{ information.unit ? $t("common.units." + information.unit) : "" }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </IonCard>
          
          <IonCard v-for="item in order.customItems" :key="item.id" class="m-0 mb-4 overflow-hidden space-y-2">
            <ImageContainer :imageUrl="item.imageFileUrl" class="max-h-40" />
            <div v-for="alteration in item.alterations" :key="alteration.id" class="px-4 py-2">
              <TranslatedName :names="alteration" class="font-semibold" />
              <div class="grid grid-cols-2 gap-4">
                <div v-for="information in alteration.informations" :key="information.id" class="px-4 py-2 bg-gray-100 rounded-lg">
                  <TranslatedName :names="information" />
                  <p class="truncate">{{ information.value }} {{ information.unit ? $t("common.units." + information.unit) : "" }}</p>
                </div>
              </div>
            </div>
          </IonCard>
        </IonCard>

        <IonCard class="ion-padding space-y-4">
          <p class="font-bold">{{ $t("tailor.orderDetails.chat.title") }}</p>
          <Chat />
        </IonCard>

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
            <span v-else>{{ $t("courier.orderDetails.confirmPickup") }}</span>
          </IonButton>

          <IonButton
            v-if="canMarkDelivered"
            expand="block"
            color="success"
            @click="handleDeliver"
            :disabled="isActionLoading"
          >
            <IonSpinner v-if="isActionLoading" name="crescent" />
            <span v-else>{{ $t("courier.orderDetails.markAsDelivered") }}</span>
          </IonButton>
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonContent,
  IonPage,
  IonSpinner,
} from "@ionic/vue";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QrcodeSvg } from "qrcode.vue";
import { MapPin } from "lucide-vue-next";
import Chat from "@/components/chat/Chat.vue";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { formatDate } from "@/utils";
import { useToast } from "@/composables";
import { apiClient } from "@/integration/api";
import { useAuthStore } from "@/stores";
import { ImageContainer, TranslatedName, StatusPill, SecondaryHeader, OrderTimeline } from "@/components";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const order = ref<DisplayOrderDTO>();
const isLoading = ref(true);
const isActionLoading = ref(false);

const orderId = computed(() => route.params.id as string);

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

onMounted(fetchOrder);
</script>

<style scoped>
</style>
