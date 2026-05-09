<template>
  <IonPage>
    <SecondaryHeader :title="stepTitle" default-href="/customer/cart" />
    <IonContent class="ion-padding">
      <!-- Step 1: Address Selection -->
      <div v-if="step === 'address'" class="space-y-6">
        <h2 class="text-xl font-bold">Select Delivery Address</h2>
        <div v-if="authStore.userAddresses.length === 0" class="text-center py-10 bg-gray-50 rounded-2xl">
          <MapPin class="mx-auto w-12 h-12 text-muted-foreground mb-2" />
          <p>You haven't added any addresses yet.</p>
          <IonButton fill="clear" @click="goToProfile">Add Address in Profile</IonButton>
        </div>
        <div v-else class="space-y-4">
          <IonCard
            v-for="address in authStore.userAddresses"
            :key="address.id"
            class="m-0 ion-padding border-2 transition-colors"
            :class="selectedAddressId === address.id ? 'border-primary' : 'border-transparent'"
            @click="selectedAddressId = address.id"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                :class="selectedAddressId === address.id ? 'border-primary' : 'border-gray-300'"
              >
                <div v-if="selectedAddressId === address.id" class="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <div>
                <p class="font-bold">{{ address.city }}</p>
                <p class="text-sm text-muted-foreground">{{ address.district }} {{ address.street }}</p>
              </div>
            </div>
          </IonCard>
        </div>

        <div class="pt-10">
          <IonButton 
            expand="block" 
            :disabled="!selectedAddressId || isProcessing" 
            @click="proceedToPayment"
          >
            <IonSpinner v-if="isProcessing" name="crescent" />
            <span v-else>Proceed to Payment</span>
          </IonButton>
        </div>
      </div>

      <!-- Step 2: Moyasar Payment -->
      <div v-if="step === 'payment'" class="space-y-6">
        <div class="bg-gray-50 p-4 rounded-xl mb-6">
          <div class="flex justify-between mb-2">
            <span>Order Reference:</span>
            <span class="font-bold">#{{ createdOrder?.reference }}</span>
          </div>
          <div class="flex justify-between">
            <span>Total Amount:</span>
            <span class="font-bold text-primary">{{ createdOrder?.totalPrice }} SAR</span>
          </div>
        </div>

        <div class="mysr-form"></div>
        
        <div v-if="paymentError" class="p-4 bg-danger/10 text-danger rounded-lg text-sm text-center">
          {{ paymentError }}
        </div>
      </div>

      <!-- Step 3: Success -->
      <div v-if="step === 'success'" class="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div class="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center">
          <Check class="w-12 h-12 text-success" />
        </div>
        <div>
          <h2 class="text-2xl font-bold">Order Placed!</h2>
          <p class="text-muted-foreground mt-2">
            Your order #{{ createdOrder?.reference }} has been successfully placed and is pending tailor assignment.
          </p>
        </div>
        <IonButton expand="block" class="w-full" @click="goToOrders">
          View My Orders
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonButton,
  IonCard,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { SecondaryHeader } from "@/components";
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useCartStore } from "@/stores";
import { useRouter } from "vue-router";
import { MapPin, Check } from "lucide-vue-next";
import { DisplayOrderDTO } from "@/integration/dtos";

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const step = ref<"address" | "payment" | "success">("address");
const selectedAddressId = ref<string>("");
const isProcessing = ref(false);
const createdOrder = ref<DisplayOrderDTO | null>(null);
const paymentError = ref("");

const stepTitle = computed(() => {
  if (step.value === "address") return "Checkout - Address";
  if (step.value === "payment") return "Checkout - Payment";
  return "Checkout Success";
});

function goToProfile() {
  router.push("/profile");
}

function goToOrders() {
  router.push("/customer/orders");
}

async function proceedToPayment() {
  if (!selectedAddressId.value) return;

  isProcessing.value = true;
  try {
    const order = await cartStore.createOrder(selectedAddressId.value);
    createdOrder.value = order;
    step.value = "payment";
    initMoyasar();
  } catch (error) {
    console.error("Failed to create order", error);
    const toast = await toastController.create({
      message: "Failed to create order. Please try again.",
      duration: 2000,
      color: "danger",
    });
    toast.present();
  } finally {
    isProcessing.value = false;
  }
}

function initMoyasar() {
  // 1. Inject Styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.7/dist/moyasar.css';
  document.head.appendChild(link);

  // 2. Inject Script
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.7/dist/moyasar.umd.min.js';
  script.async = true;
  script.onload = () => {
    // @ts-ignore
    Moyasar.init({
      element: '.mysr-form',
      amount: (createdOrder.value?.totalPrice || 0) * 100, // Halalas
      currency: 'SAR',
      description: `Order #${createdOrder.value?.reference} for Tadil`,
      publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY || 'pk_test_placeholder',
      callback_url: window.location.origin + '/customer/checkout', // Moyasar will redirect back here if not handled by on_completed
      methods: ['creditcard'],
      on_completed: async (payment: any) => {
        if (payment.status === 'paid') {
          try {
            await cartStore.confirmPayment(createdOrder.value!.id, payment.id);
            step.value = "success";
          } catch (err) {
            console.error("Payment confirmation failed", err);
            paymentError.value = "Payment was successful, but we failed to update your order. Please contact support.";
          }
        } else {
          paymentError.value = `Payment failed with status: ${payment.status}`;
        }
      }
    });
  };
  document.body.appendChild(script);
}

onMounted(async () => {
  if (authStore.userAddresses.length === 0) {
    await authStore.fetchAddresses();
  }
});
</script>

<style>
/* Custom Moyasar Overrides if needed */
.mysr-form {
  max-width: 100%;
}
</style>
