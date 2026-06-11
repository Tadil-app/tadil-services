<template>
  <IonPage>
    <SecondaryHeader :title="stepTitle" default-href="/customer/cart" />
    <IonContent class="ion-padding">
      <EmptyState
        v-if="cartStore.itemsCount === 0"
        :icon="ShoppingBag"
        :title="$t('cart.emptyTitle')"
        :description="$t('cart.emptyDescription')"
      >
        <IonButton
          fill="solid"
          color="primary"
          shape="round"
          class="px-8"
          router-link="/customer/new-order"
        >
          {{ $t("cart.shopNow") }}
        </IonButton>
      </EmptyState>

      <template v-else>
        <!-- Step 1: Address Selection -->
        <div v-if="step === 'address'" class="space-y-6">
        <h2 class="text-xl font-bold">{{ $t('checkout.address.title') }}</h2>
        <div
          v-if="authStore.userAddresses.length === 0"
          class="text-center py-10 bg-gray-50 rounded-2xl"
        >
          <MapPin class="mx-auto w-12 h-12 text-muted-foreground mb-2" />
          <p>{{ $t('checkout.address.empty') }}</p>
          <IonButton fill="clear" @click="goToProfile">
            {{ $t('checkout.address.addInProfile') }}
          </IonButton>
        </div>
        <div v-else class="space-y-4">
          <IonCard
            v-for="address in authStore.userAddresses"
            :key="address.id"
            class="m-0 ion-padding border-2 transition-colors"
            :class="
              selectedAddressId === address.id
                ? 'border-primary'
                : 'border-transparent'
            "
            @click="selectedAddressId = address.id"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                :class="
                  selectedAddressId === address.id
                    ? 'border-primary'
                    : 'border-gray-300'
                "
              >
                <div
                  v-if="selectedAddressId === address.id"
                  class="w-2.5 h-2.5 rounded-full bg-primary"
                />
              </div>
              <div>
                <p class="font-bold">{{ address.city }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ address.district }} {{ address.street }}
                </p>
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
            <span v-else>{{ $t('checkout.buttons.proceedToPayment') }}</span>
          </IonButton>
        </div>
      </div>

      <!-- Step 2: Moyasar Payment -->
      <div v-if="step === 'payment'" class="space-y-6">
        <div class="bg-gray-50 p-4 rounded-xl mb-6">
          <div class="flex justify-between mb-2">
            <span>{{ $t('checkout.orderInfo.reference') }}</span>
            <span class="font-bold">#{{ createdOrder?.reference }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('checkout.orderInfo.totalAmount') }}</span>
            <span class="font-bold text-primary">
              {{ createdOrder?.totalPrice }}
              {{ $t('common.currencies.sar') }}
            </span>
          </div>
        </div>

        <div class="mysr-form"></div>

        <div
          v-if="paymentError"
          class="p-4 bg-danger/10 text-danger rounded-lg text-sm text-center"
        >
          {{ paymentError }}
        </div>
      </div>
      </template>
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
  onIonViewWillEnter,
} from '@ionic/vue';
import { SecondaryHeader, EmptyState } from '@/components';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore, useCartStore } from '@/stores';
import { useRouter } from 'vue-router';
import { MapPin, ShoppingBag } from 'lucide-vue-next';
import { DisplayOrderDTO } from '@/integration/dtos';
import { useI18n } from 'vue-i18n';
import { Preferences } from '@capacitor/preferences';

const { t } = useI18n();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const step = ref<'address' | 'payment'>('address');
const selectedAddressId = ref<string>('');
const isProcessing = ref(false);
const createdOrder = ref<DisplayOrderDTO | null>(null);
const paymentError = ref('');

onIonViewWillEnter(async () => {
  const { value: shouldRedirect } = await Preferences.get({ key: 'redirectToOrders' });
  if (shouldRedirect === 'true') {
    await Preferences.remove({ key: 'redirectToOrders' });
    router.push('/customer/orders');
  }
});

const stepTitle = computed(() => {
  if (step.value === 'address') return t('checkout.address.title');
  if (step.value === 'payment') return t('tailor.orderDetails.title');
  return '';
});

function goToProfile() {
  router.push('/profile');
}

function goToOrders() {
  router.push('/customer/orders');
}

async function proceedToPayment() {
  if (!selectedAddressId.value) return;

  isProcessing.value = true;
  try {
    const order = await cartStore.createOrder(selectedAddressId.value);
    createdOrder.value = order;
    await Preferences.set({ key: 'pendingOrderId', value: order.id });
    await Preferences.set({ key: 'pendingOrderReference', value: order.reference });
    step.value = 'payment';
    initMoyasar();
  } catch (error) {
    console.error('Failed to create order', error);
    const toast = await toastController.create({
      message: 'Failed to create order. Please try again.',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  } finally {
    isProcessing.value = false;
  }
}

function initMoyasar() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.umd.min.js';
  script.async = true;
  script.onload = () => {
    // @ts-ignore
    Moyasar.init({
      element: '.mysr-form',
      amount: (createdOrder.value?.totalPrice || 0) * 100, // Halalas
      currency: 'SAR',
      description: `Order #${createdOrder.value?.reference} for Tadil`,
      publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY,
      callback_url: window.location.origin + '/customer/checkout/verify',
      supported_networks: ['visa', 'mastercard', 'mada'],
      methods: ['creditcard']
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
