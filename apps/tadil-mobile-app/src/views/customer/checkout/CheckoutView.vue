<template>
  <IonPage>
    <SecondaryHeader
      :title="stepTitle"
      default-href="/customer/cart"
      force-default-href
    />
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
                <p class="font-bold">{{ cityName(address) }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ districtName(address) }} {{ streetName(address) }}
                </p>
              </div>
            </div>
          </IonCard>
        </div>

        <div class="pt-10 space-y-3">
          <p
            v-if="paysCashOnDelivery"
            class="text-sm text-center text-muted-foreground"
          >
            {{ $t('checkout.cashOnDelivery.note') }}
          </p>
          <IonButton
            expand="block"
            :disabled="!selectedAddressId || isProcessing"
            @click="proceedToPayment"
          >
            <IonSpinner v-if="isProcessing" name="crescent" />
            <span v-else>{{
              paysCashOnDelivery
                ? $t('checkout.cashOnDelivery.button')
                : $t('checkout.buttons.proceedToPayment')
            }}</span>
          </IonButton>
        </div>
      </div>

      <div
        v-if="step === 'success'"
        class="flex flex-col items-center justify-center py-20 text-center space-y-6"
      >
        <div class="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center">
          <Check class="w-12 h-12 text-success" />
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{ $t('checkout.success.title') }}</h2>
          <p class="text-muted-foreground mt-2">
            {{ $t('checkout.success.message', { reference: createdOrder?.reference }) }}
          </p>
          <p v-if="paysCashOnDelivery" class="text-sm text-muted-foreground mt-3">
            {{ $t('checkout.cashOnDelivery.confirmed') }}
          </p>
        </div>
        <IonButton expand="block" class="w-full" @click="goToOrders">
          {{ $t('customer.ordersHistory.title') }}
        </IonButton>
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

        <button
          v-if="applePayAvailable"
          type="button"
          class="apple-pay-button"
          dir="ltr"
          :disabled="applePayBusy"
          :aria-label="$t('checkout.payment.applePay')"
          @click="payWithApplePay"
        >
          {{ $t('checkout.payment.applePay') }}
        </button>

        <div
          v-if="applePayAvailable"
          class="flex items-center gap-3 text-sm text-muted-foreground"
        >
          <div class="flex-1 h-px bg-gray-200" />
          <span>{{ $t('checkout.payment.orCard') }}</span>
          <div class="flex-1 h-px bg-gray-200" />
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useAuthStore, useCartStore, useLanguageStore } from '@/stores';
import { useLocalizedAddress } from '@/composables';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { Check, MapPin, ShoppingBag } from 'lucide-vue-next';
import { isAppleReviewPhone } from '@/utils/appleReviewPhones';
import { DisplayOrderDTO } from '@/integration/dtos';
import { useI18n } from 'vue-i18n';
import { Preferences } from '@capacitor/preferences';
import {
  ApplePay,
  APPLE_PAY_MERCHANT_ID,
  formatApplePayAmount,
  isApplePayCanceled,
  isNativeIos,
  nativeApplePayAvailable,
} from '@/plugins/applePay';

const { t } = useI18n();
const authStore = useAuthStore();
const cartStore = useCartStore();
const languageStore = useLanguageStore();
const router = useRouter();

// Show the stored city/district in the viewer's current language.
const { cityName, districtName, streetName } = useLocalizedAddress();

const step = ref<'address' | 'payment' | 'success'>('address');
const selectedAddressId = ref<string>('');
const isProcessing = ref(false);
const createdOrder = ref<DisplayOrderDTO | null>(null);
const paymentError = ref('');
const applePayAvailable = ref(false);
const applePayBusy = ref(false);

onBeforeRouteLeave(async (to) => {
  // The payment callback lands on the verify page; it owns the order then.
  if (to.name === 'customer-checkout-verify') return;
  await cartStore.reconcilePendingOrder();
});

onIonViewWillEnter(async () => {
  // Ionic caches this page. A return from a failed or abandoned payment must
  // start again from the address, not on a Moyasar form for a dropped order.
  resetCheckout();

  const { value: shouldRedirect } = await Preferences.get({ key: 'redirectToOrders' });
  if (shouldRedirect === 'true') {
    await Preferences.remove({ key: 'redirectToOrders' });
    router.push('/customer/orders');
  }
});

function resetCheckout() {
  stopPinningMoyasarDir();
  step.value = 'address';
  createdOrder.value = null;
  paymentError.value = '';
  applePayAvailable.value = false;
  applePayBusy.value = false;
}

const paysCashOnDelivery = computed(() =>
  isAppleReviewPhone(authStore.userInfo?.phone)
);

const stepTitle = computed(() => {
  if (step.value === 'address') return t('checkout.address.title');
  if (step.value === 'payment') return t('tailor.orderDetails.title');
  if (step.value === 'success') return t('checkout.success.title');
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
    // Settle any earlier checkout first so it is not left orphaned. If it
    // turns out to have been paid, the cart is already cleared: show it.
    const previous = await cartStore.reconcilePendingOrder();
    if (previous === 'confirmed') {
      router.replace('/customer/orders');
      return;
    }
    if (previous === 'error') {
      throw new Error('Could not settle the previous checkout');
    }

    const order = await cartStore.createOrder(selectedAddressId.value);
    createdOrder.value = order;

    if (order.cashOnDelivery) {
      await cartStore.clearCart();
      step.value = 'success';
      return;
    }

    await Preferences.set({ key: 'pendingOrderId', value: order.id });
    await Preferences.set({ key: 'pendingOrderReference', value: order.reference });
    applePayAvailable.value = await nativeApplePayAvailable();
    step.value = 'payment';
    await nextTick();
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

const IOS_PAYMENT_RETURN_URL =
  'https://tadil-mobile-app-production-1db5.up.railway.app/payment-return.html';

function moyasarCallbackUrl(): string {
  const path = '/customer/checkout/verify';
  const origin = window.location.origin;
  // Moyasar only accepts an http(s) callback. The iPhone app runs on
  // capacitor://localhost, which the form rejects before it is shown.
  if (/^https?:\/\//i.test(origin)) {
    return `${origin}${path}`;
  }
  return IOS_PAYMENT_RETURN_URL;
}

function initMoyasar() {
  const publishableKey = import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY as
    | string
    | undefined;
  if (!publishableKey || !/^pk_(test|live)_/.test(publishableKey)) {
    console.error(
      'VITE_MOYASAR_PUBLISHABLE_KEY is missing or invalid. Moyasar cannot render the payment form.'
    );
    paymentError.value = t('checkout.payment.unavailable');
    return;
  }

  const amount = Math.round(Number(createdOrder.value?.totalPrice || 0) * 100);
  if (amount < 100) {
    console.error('Moyasar amount must be an integer of at least 100 halalas.', {
      totalPrice: createdOrder.value?.totalPrice,
      amount,
    });
    paymentError.value = t('checkout.payment.unavailable');
    return;
  }

  const orderId = createdOrder.value?.id;
  const renderForm = () => {
    // @ts-ignore
    Moyasar.init({
      element: '.mysr-form',
      amount,
      currency: 'SAR',
      description: `Order #${createdOrder.value?.reference} for Tadil`,
      publishable_api_key: publishableKey,
      callback_url: moyasarCallbackUrl(),
      // Arabic labels. The form also paints dir="rtl" on its wrapper; that
      // attribute is stripped just after init so iPhone does not mirror it.
      language: languageStore.currentLocale.direction === 'rtl' ? 'ar' : 'en',
      // Lets the server find this order's payment without the callback.
      metadata: { order_id: orderId },
      supported_networks: ['visa', 'mastercard', 'mada'],
      // Native iOS uses PassKit (WKWebView cannot start an Apple Pay JS session).
      methods: isNativeIos() ? ['creditcard'] : ['creditcard', 'applepay'],
      apple_pay: {
        country: 'SA',
        label: 'Tadil',
        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
      },
      // Cards with 3DS still return via callback_url. Apple Pay is paid in
      // place, so send those to verify immediately. Confirm is idempotent.
      on_completed: async (payment: { id?: string; status?: string; message?: string }) => {
        if (payment?.status !== 'paid' || !payment.id) return;
        await router.replace({
          name: 'customer-checkout-verify',
          query: {
            id: payment.id,
            status: payment.status,
            message: payment.message || 'Succeeded',
          },
        });
      },
    });
    pinMoyasarFormDirection();
  };

  // @ts-ignore
  if (typeof window.Moyasar !== 'undefined') {
    renderForm();
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.9/dist/moyasar.umd.min.js';
  script.async = true;
  script.onload = renderForm;
  document.body.appendChild(script);
}

async function payWithApplePay() {
  const publishableKey = import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY as
    | string
    | undefined;
  if (!publishableKey || !/^pk_(test|live)_/.test(publishableKey)) {
    paymentError.value = t('checkout.payment.unavailable');
    return;
  }

  const amountHalalas = Math.round(Number(createdOrder.value?.totalPrice || 0) * 100);
  const orderId = createdOrder.value?.id;
  if (!orderId || amountHalalas < 100) {
    paymentError.value = t('checkout.payment.unavailable');
    return;
  }

  applePayBusy.value = true;
  paymentError.value = '';
  try {
    const payment = await ApplePay.pay({
      merchantId: APPLE_PAY_MERCHANT_ID,
      countryCode: 'SA',
      currencyCode: 'SAR',
      label: 'Tadil',
      amount: formatApplePayAmount(Number(createdOrder.value?.totalPrice || 0)),
      amountHalalas,
      description: `Order #${createdOrder.value?.reference} for Tadil`,
      publishableApiKey: publishableKey,
      orderId,
    });
    if (payment.status !== 'paid' || !payment.id) {
      paymentError.value = payment.message || t('checkout.payment.applePayFailed');
      return;
    }
    await router.replace({
      name: 'customer-checkout-verify',
      query: {
        id: payment.id,
        status: payment.status,
        message: payment.message || 'Succeeded',
      },
    });
  } catch (error) {
    if (isApplePayCanceled(error)) return;
    console.error('Apple Pay failed', error);
    paymentError.value = t('checkout.payment.applePayFailed');
  } finally {
    applePayBusy.value = false;
  }
}

let moyasarDirObserver: MutationObserver | null = null;

function stopPinningMoyasarDir() {
  moyasarDirObserver?.disconnect();
  moyasarDirObserver = null;
}

function pinMoyasarFormDirection() {
  const host = document.querySelector('.mysr-form');
  if (!host) return;

  const pin = (root: Element) => {
    if (root.getAttribute('dir') === 'rtl') root.setAttribute('dir', 'ltr');
    root.querySelectorAll('[dir="rtl"]').forEach((el) => {
      el.setAttribute('dir', 'ltr');
    });
  };

  pin(host);
  stopPinningMoyasarDir();
  moyasarDirObserver = new MutationObserver(() => pin(host));
  moyasarDirObserver.observe(host, {
    attributes: true,
    attributeFilter: ['dir'],
    childList: true,
    subtree: true,
  });
}

onBeforeUnmount(() => {
  stopPinningMoyasarDir();
});

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

/* iPhone mirrors any element that carries an explicit dir="rtl". Moyasar
   sets that on its wrapper when language is Arabic; JS pins the attribute
   to ltr. CSS direction restores RTL layout without triggering the mirror.
   Card number / expiry / CVC keep dir="ltr" so digits type left-to-right. */
html[dir="rtl"] .mysr-form #mysr > div {
  direction: rtl;
}

html[dir="rtl"] .mysr-form [dir="ltr"] {
  direction: ltr;
}

.apple-pay-button {
  display: block;
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  -webkit-appearance: -apple-pay-button;
  -apple-pay-button-type: check-out;
  -apple-pay-button-style: black;
}

.apple-pay-button:disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
