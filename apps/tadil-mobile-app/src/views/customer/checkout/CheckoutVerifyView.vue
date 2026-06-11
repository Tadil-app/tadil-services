<template>
  <IonPage>
    <SecondaryHeader :title="$t('checkout.verification.title', 'Payment Verification')" default-href="/customer/cart" />
    <IonContent class="ion-padding">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <IonSpinner name="crescent" />
        <p class="mt-4 text-muted-foreground">{{ $t('checkout.verification.processing', 'Processing your payment...') }}</p>
      </div>

      <div v-else-if="isSuccess" class="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div class="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center">
          <Check class="w-12 h-12 text-success" />
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{ $t('checkout.success.title') }}</h2>
          <p class="text-muted-foreground mt-2">
             {{ $t('checkout.success.message', { reference: orderReference }) }}
          </p>
        </div>
        <IonButton expand="block" class="w-full" @click="goToOrders">
          {{ $t('customer.ordersHistory.title') }}
        </IonButton>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div class="w-24 h-24 bg-danger/20 rounded-full flex items-center justify-center">
          <X class="w-12 h-12 text-danger" />
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{ $t('checkout.error.title', 'Payment Error') }}</h2>
          <p class="text-muted-foreground mt-2">{{ errorMessage }}</p>
        </div>
        <IonButton expand="block" class="w-full" @click="goBack">
          {{ $t('checkout.buttons.tryAgain', 'Try Again') }}
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonSpinner, IonButton, useBackButton } from '@ionic/vue';
import { SecondaryHeader } from '@/components';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores';
import { Preferences } from '@capacitor/preferences';
import { Check, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref('');

useBackButton(10, async () => {
  await goBack();
});

const orderReference = ref('');
onMounted(async () => {
  const paymentId = route.query.id as string;
  const status = route.query.status as string;
  const message = route.query.message as string;

  if (!paymentId || !status) {
    errorMessage.value = t('checkout.error.invalidCallback', 'Invalid payment callback received.');
    isLoading.value = false;
    return;
  }

  if (status !== 'paid') {
    errorMessage.value = message || t('checkout.error.paymentFailed', 'Payment failed.');
    isLoading.value = false;
    return;
  }

  const { value: pendingOrderId } = await Preferences.get({ key: 'pendingOrderId' });

  if (!pendingOrderId) {
    // If order is already processed, safely navigate away
    await goToOrders();
    return;
  }

  orderReference.value = (await Preferences.get({ key: 'pendingOrderReference' })).value || '';

  try {
    await cartStore.confirmPayment(pendingOrderId, paymentId);
    isSuccess.value = true;
    await Preferences.remove({ key: 'pendingOrderId' });
    await Preferences.remove({ key: 'pendingOrderReference' });
    await cartStore.clearCart();
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    errorMessage.value = t('checkout.error.confirmationFailed', 'Payment was successful, but we failed to update your order. Please contact support.');
  } finally {
    isLoading.value = false;
  }
});

async function goToOrders() {
    router.replace('/customer/orders');
}

async function goBack() {
    router.replace('/customer/checkout');
}
</script>
