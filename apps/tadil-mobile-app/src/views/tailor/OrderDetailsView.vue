<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('tailor.orderDetails.title')"
      default-href="/tailor/orders"
    />
    <IonContent class="ion-padding space-y-6">
      <template v-if="order">
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

        <!-- Alterations omitted for brevity in this replace call, but they should remain -->
        <!-- I'll use write_file to be sure I don't break the complex UI -->

        <IonCard color="transparent" class="ion-padding">
          <p>{{ $t("tailor.orderDetails.alterations.title") }}</p>
          <IonCard v-for="item in order.items" :key="item.id">
            <ImageContainer :imageUrl="item.imageFileUrl" class="max-h-40" />
            <div class="divide-y divide-border space-y-2">
              <div v-for="section in item.sections" :key="section.id" class="p-2">
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
              <div class="font-semibold text-secondary text-lg p-2">
                {{ $t("common.price") }}: {{ item.price }} {{ $t("common.currencies.sar") }}
              </div>
            </div>
          </IonCard>
          <IonCard v-for="item in order.customItems" :key="item.id" class="space-y-2">
            <ImageContainer :imageUrl="item.imageFileUrl" class="max-h-40" />
            <div v-for="alteration in item.alterations" :key="alteration.id" class="px-4">
              <TranslatedName :names="alteration" class="font-semibold" />
              <div class="grid grid-cols-2 gap-4">
                <div v-for="information in alteration.informations" :key="information.id" class="px-4 py-2 bg-gray-100 rounded-lg">
                  <TranslatedName :names="information" />
                  <p class="truncate">{{ information.value }} {{ information.unit ? $t("common.units." + information.unit) : "" }}</p>
                </div>
              </div>
            </div>
            <div class="border-t border-border font-semibold text-secondary text-lg p-2">
              {{ $t("common.price") }}: {{ item.price }} {{ $t("common.currencies.sar") }}
            </div>
          </IonCard>
        </IonCard>

        <!-- Chat Section -->
        <div v-if="order" class="px-4 pb-10">
          <h3 class="text-lg font-bold mb-3 px-2 text-main">{{ $t('chat.title') }}</h3>
          <div class="h-125 border border-main/5 rounded-3xl overflow-hidden shadow-sm bg-item">
            <Chat :key="order.id" :order-id="order.id" channel="TAILOR" />
          </div>
        </div>

        <!-- Action Buttons based on New Flow -->
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4" v-if="order.status === ORDER_STATUS.WAITING_FOR_TAILOR_ASSIGNMENT">
            <IonButton expand="block" color="danger" @click="declineOrder">{{ $t("tailor.orderDetails.declineOrder.buttonText") }}</IonButton>
            <IonButton expand="block" color="success" @click="acceptOrder">{{ $t("tailor.orderDetails.acceptOrder.buttonText") }}</IonButton>
          </div>

          <IonButton
            v-if="order.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR"
            expand="block"
            color="success"
            @click="confirmReceipt"
          >
            {{ $t("tailor.orderDetails.confirmReceiptFromCourier") }}
          </IonButton>

          <IonButton
            v-if="order.status === ORDER_STATUS.IN_PROGRESS"
            expand="block"
            color="secondary"
            @click="markReady"
          >
            {{ $t("tailor.orderDetails.markWorkAsReady") }}
          </IonButton>
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { useOrders } from "./composables/useOrders.composable";
import { formatDate } from "@/utils";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";
import { apiClient } from "@/integration/api";
import { useAuthStore } from "@/stores";
import { ImageContainer, TranslatedName, StatusPill, SecondaryHeader, OrderTimeline, Chat } from "@/components";
import { IonButton, IonCard, IonContent, IonPage } from "@ionic/vue";
import { QrcodeSvg } from "qrcode.vue";

const props = defineProps<{
  orderId: string;
}>();

const { t } = useI18n();
const { showToast, dismissToast } = useToast();
const authStore = useAuthStore();
const router = useRouter();

const order = ref<DisplayOrderDTO>();
const { orders, getOrders } = useOrders();

async function findOrderById() {
  if (!props.orderId) {
    router.replace({ name: "tailor-orders" });
    return;
  }
  await getOrders();
  order.value = orders.value.find((o) => o.reference === props.orderId);
  if (!order.value) {
    router.replace({ name: "tailor-orders" });
    return;
  }
}

async function acceptOrder() {
  try {
    if (!order.value) return;
    await apiClient.tailorControllerAcceptOrder(authStore.userId, order.value.id);
    await findOrderById();
    showToast({ message: t("tailor.orderDetails.acceptOrder.successMessage") });
  } catch (error) {
    showToast({ message: t("tailor.orderDetails.acceptOrder.errorMessage") });
  }
}

async function declineOrder() {
  try {
    if (!order.value) return;
    await apiClient.tailorControllerDeclineOrder(authStore.userId, order.value.id);
    showToast({ message: t("tailor.orderDetails.declineOrder.successMessage") });
    router.replace({ name: "tailor-orders" });
  } catch (error) {
    showToast({ message: t("tailor.orderDetails.declineOrder.errorMessage") });
  }
}

async function confirmReceipt() {
  try {
    if (!order.value) return;
    await apiClient.tailorControllerConfirmReceipt(authStore.userId, order.value.id);
    await findOrderById();
    showToast({ message: t("common.messages.confirmReceiptSuccess") });
  } catch (error) {
    showToast({ message: t("common.messages.confirmReceiptError"), color: "danger" });
  }
}

async function markReady() {
  try {
    if (!order.value) return;
    await apiClient.tailorControllerMarkReady(authStore.userId, order.value.id);
    await findOrderById();
    showToast({ message: t("common.messages.markReadySuccess") });
  } catch (error) {
    showToast({ message: t("common.messages.markReadyError"), color: "danger" });
  }
}

onBeforeMount(async () => {
  await findOrderById();
});

onBeforeUnmount(() => {
  dismissToast();
});
</script>
