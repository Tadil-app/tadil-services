<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('customer.ordersHistory.title')"
      default-href="/customer/orders"
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

        <IonCard color="transparent" class="ion-padding">
          <p>{{ $t("tailor.orderDetails.alterations.title") }}</p>
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
              <div class="font-semibold text-secondary text-lg p-2">
                {{ $t("common.price") }}: {{ item.price }} {{ $t("common.currencies.sar") }}
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
            <div class="border-t border-border font-semibold text-secondary text-lg p-2">
              {{ $t("common.price") }}: {{ item.price }} {{ $t("common.currencies.sar") }}
            </div>
          </IonCard>
        </IonCard>

        <IonCard class="ion-padding space-y-4">
          <p class="font-bold">{{ $t("tailor.orderDetails.chat.title") }}</p>
          <Chat />
        </IonCard>

        <!-- Action Button: Confirm Receipt from Return Courier -->
        <div v-if="order.status === ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER" class="pt-4">
          <IonButton expand="block" color="success" @click="confirmReceipt" :disabled="isActionLoading">
            <IonSpinner v-if="isActionLoading" name="crescent" />
            <span v-else>{{ $t("customer.orderDetails.confirmReceipt") }}</span>
          </IonButton>
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonButton, IonCard, IonContent, IonPage, IonSpinner } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { QrcodeSvg } from "qrcode.vue";
import Chat from "@/components/chat/Chat.vue";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { useCustomerOrders } from "./composables/useCustomerOrders.composable";
import { formatDate } from "@/utils";
import { useToast } from "@/composables";
import { useI18n } from "vue-i18n";
import { apiClient } from "@/integration/api";
import { ImageContainer, TranslatedName, StatusPill, SecondaryHeader, OrderTimeline } from "@/components";

const props = defineProps<{
  orderId: string;
}>();

const { t } = useI18n();
const { showToast } = useToast();
const router = useRouter();

const order = ref<DisplayOrderDTO>();
const isActionLoading = ref(false);
const { orders, isLoading, fetchOrders } = useCustomerOrders();

async function findOrderById() {
  if (!props.orderId) {
    router.replace({ name: "customer-orders-history" });
    return;
  }
  await fetchOrders();
  order.value = orders.value.find((o) => o.reference === props.orderId);
  if (!order.value) {
    router.replace({ name: "customer-orders-history" });
    return;
  }
}

async function confirmReceipt() {
  if (!order.value) return;
  isActionLoading.value = true;
  try {
    await apiClient.customerControllerConfirmReceipt(order.value.id);
    await findOrderById();
    showToast({ message: "Receipt confirmed. Order is now complete!" });
  } catch (error) {
    console.error("Failed to confirm receipt", error);
    showToast({ message: "Failed to confirm receipt. Please try again.", color: "danger" });
  } finally {
    isActionLoading.value = false;
  }
}

onMounted(async () => {
  await findOrderById();
});
</script>

<style scoped>
</style>
