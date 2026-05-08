<template>
  <IonPage>
    <SecondaryHeader :title="order ? '#' + order.reference : 'Order Details'" default-href="/courier/orders" />
    <IonContent class="ion-padding">
      <div v-if="isLoading" class="flex justify-center py-10">
        <IonSpinner name="crescent" />
      </div>
      <div v-else-if="order" class="space-y-6">
        <!-- Order Info -->
        <IonCard class="m-0 ion-padding">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-xl font-bold">#{{ order.reference }}</h2>
              <p class="text-sm text-muted-foreground">{{ formatDate(order.date) }}</p>
            </div>
            <IonBadge :color="getStatusColor(order.status)">
              {{ order.status }}
            </IonBadge>
          </div>
          <p class="text-lg font-semibold">{{ order.totalPrice }} SAR</p>
        </IonCard>

        <!-- Actions -->
        <div class="space-y-3">
          <!-- Accept/Decline Assignment -->
          <div v-if="isPendingAssignment" class="flex gap-4">
            <IonButton expand="block" class="flex-1" @click="handleAccept" :disabled="isActionLoading">
              Accept
            </IonButton>
            <IonButton expand="block" color="danger" fill="outline" class="flex-1" @click="handleDecline" :disabled="isActionLoading">
              Decline
            </IonButton>
          </div>

          <!-- Confirm Pickup -->
          <IonButton
            v-if="canConfirmPickup"
            expand="block"
            @click="handlePickup"
            :disabled="isActionLoading"
          >
            Confirm Pickup
          </IonButton>

          <!-- Mark Delivered -->
          <IonButton
            v-if="canMarkDelivered"
            expand="block"
            @click="handleDeliver"
            :disabled="isActionLoading"
          >
            Mark as Delivered
          </IonButton>
        </div>

        <!-- Address/Items Summary (Simplified) -->
        <IonCard class="m-0 ion-padding">
          <h3 class="font-bold mb-2">Order Items</h3>
          <p class="text-sm text-muted-foreground">
            {{ order.items.length + order.customItems.length }} items to be handled.
          </p>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { SecondaryHeader } from "@/components";
import {
  IonPage,
  IonContent,
  IonCard,
  IonSpinner,
  IonBadge,
  IonButton,
  toastController,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores";
import { apiClient } from "@/integration/api";
import { DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
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
    order.value = data.find((o: DisplayOrderDTO) => o.id === orderId.value);
  } catch (error) {
    console.error("Failed to fetch order", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleAccept() {
  await performAction(() => 
    apiClient.courierControllerAccept(authStore.userId, orderId.value, { isReturn: String(isReturnTrip.value) })
  );
}

async function handleDecline() {
  await performAction(() => 
    apiClient.courierControllerDecline(authStore.userId, orderId.value, { isReturn: String(isReturnTrip.value) })
  );
  router.push('/courier/orders');
}

async function handlePickup() {
  await performAction(() => 
    apiClient.courierControllerPickup(authStore.userId, orderId.value)
  );
}

async function handleDeliver() {
  await performAction(() => 
    apiClient.courierControllerDeliver(authStore.userId, orderId.value)
  );
}

async function performAction(action: () => Promise<any>) {
  isActionLoading.value = true;
  try {
    await action();
    await fetchOrder();
    showToast("Action successful");
  } catch (error) {
    console.error("Action failed", error);
    showToast("Action failed", "danger");
  } finally {
    isActionLoading.value = false;
  }
}

async function showToast(message: string, color = "success") {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
  });
  toast.present();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

function getStatusColor(status?: string) {
  if (status === ORDER_STATUS.DONE) return "success";
  if (isPendingAssignment.value) return "warning";
  return "primary";
}

onMounted(fetchOrder);
</script>
