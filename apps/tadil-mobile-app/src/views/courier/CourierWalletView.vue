<template>
  <IonPage>
    <MainHeader :title="$t('tailor.wallet.title')" />
    <IonContent class="ion-padding">
      <div class="space-y-6">
        <!-- Balance Card -->
        <IonCard class="m-0 bg-primary text-primary-foreground ion-padding text-center">
          <IonLabel class="text-primary-foreground/80 block mb-2 uppercase tracking-wider text-xs font-semibold">
            {{ $t('tailor.wallet.currentBalance') }}
          </IonLabel>
          <p class="text-4xl font-bold">
            {{ authStore.walletDetails?.balance || 0 }} 
            <span class="text-xl font-normal">{{ $t('common.currencies.sar') }}</span>
          </p>
          <div class="mt-4">
            <IonButton 
              expand="block" 
              color="light" 
              @click="isPayoutModalOpen = true"
              :disabled="!authStore.walletDetails?.balance"
            >
              Request Payout
            </IonButton>
          </div>
        </IonCard>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <IonCard class="m-0 ion-padding">
            <IonLabel class="text-xs text-muted-foreground block mb-1">
              {{ $t('tailor.wallet.income') }}
            </IonLabel>
            <p class="font-bold">{{ totalIncome }} SAR</p>
          </IonCard>
          <IonCard class="m-0 ion-padding">
            <IonLabel class="text-xs text-muted-foreground block mb-1">
              {{ $t('tailor.wallet.transfers') }}
            </IonLabel>
            <p class="font-bold">{{ totalPayouts }} SAR</p>
          </IonCard>
        </div>

        <!-- Transactions -->
        <div>
          <h2 class="text-lg font-bold mb-3">{{ $t('tailor.wallet.recentTransaction') }}</h2>
          <div v-if="transactions.length === 0" class="text-center py-10 text-muted-foreground">
            <p>No recent transactions</p>
          </div>
          <IonCard
            v-for="trx in transactions"
            :key="trx.id"
            class="m-0 mb-4 ion-padding flex justify-between items-center"
          >
            <div class="flex gap-2 items-center">
              <ArrowDown
                v-if="trx.type === 'EARNING'"
                class="text-success bg-success/10 rounded-full p-1 w-8 h-8"
              />
              <ArrowUp v-else class="text-danger bg-danger/10 rounded-full p-1 w-8 h-8" />
              <div>
                <p class="font-semibold text-sm">
                  {{
                    trx.type === "EARNING"
                      ? $t("tailor.wallet.payementRecieved")
                      : $t("tailor.wallet.transferSent")
                  }}
                </p>
                <p class="text-xs font-light text-muted-foreground">{{ formatDate(trx.date) }}</p>
              </div>
            </div>
            <p
              class="font-bold"
              :class="{
                'text-success': trx.type === 'EARNING',
                'text-danger': trx.type === 'PAYOUT',
              }"
            >
              {{ trx.type === "EARNING" ? "+" : "-" }}{{ trx.amount }}
            </p>
          </IonCard>
        </div>
      </div>

      <!-- Payout Request Modal -->
      <IonModal :is-open="isPayoutModalOpen" @didDismiss="isPayoutModalOpen = false">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Request Payout</IonTitle>
            <IonButtons slot="end">
              <IonButton @click="isPayoutModalOpen = false">Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <div class="space-y-6">
            <p class="text-sm text-muted-foreground text-center">
              Available balance: {{ authStore.walletDetails?.balance || 0 }} SAR
            </p>
            <IonItem>
              <IonLabel position="stacked">Amount to Withdraw</IonLabel>
              <IonInput 
                v-model="payoutAmount" 
                type="number" 
                placeholder="0.00"
                :max="authStore.walletDetails?.balance"
              />
            </IonItem>
            <IonButton 
              expand="block" 
              @click="submitPayoutRequest"
              :disabled="!payoutAmount || payoutAmount <= 0 || payoutAmount > (authStore.walletDetails?.balance || 0) || isSubmitting"
            >
              <IonSpinner v-if="isSubmitting" name="crescent" />
              <span v-else>Submit Request</span>
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { MainHeader } from "@/components";
import {
  IonPage,
  IonContent,
  IonCard,
  IonLabel,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonInput,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { ArrowDown, ArrowUp } from "lucide-vue-next";
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores";
import { formatDate } from "@/utils";

const authStore = useAuthStore();
const isPayoutModalOpen = ref(false);
const payoutAmount = ref<number>();
const isSubmitting = ref(false);

const transactions = computed(() => authStore.walletDetails?.transactions || []);

const totalIncome = computed(() =>
  transactions.value
    .filter((txn: any) => txn.type === "EARNING")
    .reduce((sum: number, txn: any) => sum + txn.amount, 0),
);

const totalPayouts = computed(() =>
  transactions.value
    .filter((txn: any) => txn.type === "PAYOUT")
    .reduce((sum: number, txn: any) => sum + txn.amount, 0),
);

async function submitPayoutRequest() {
  if (!payoutAmount.value) return;
  
  isSubmitting.value = true;
  try {
    await authStore.requestPayout(Number(payoutAmount.value));
    isPayoutModalOpen.value = false;
    payoutAmount.value = undefined;
    const toast = await toastController.create({
      message: "Payout request submitted successfully",
      duration: 2000,
      color: "success",
    });
    toast.present();
  } catch (error) {
    console.error("Payout request failed", error);
    const toast = await toastController.create({
      message: "Failed to submit payout request",
      duration: 2000,
      color: "danger",
    });
    toast.present();
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  authStore.fetchWallet();
});
</script>
