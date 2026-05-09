<template>
  <IonPage>
    <SecondaryHeader
      :title="$t('tailor.wallet.title')"
      :subtitle="$t('tailor.wallet.subtitle')"
      :show-back-button="false"
    >
      <IonCard
        color="transparent"
        class="ion-padding ion-margin bg-light/20"
      >
        <div>
          <p class="text-sm">{{ $t("tailor.wallet.currentBalance") }}</p>
          <p class="text-2xl font-semibold mt-2 mb-4">
            {{ $t("common.currencies.sar") }} {{ authStore.walletDetails?.balance || 0 }}
          </p>
          <IonButton 
            expand="block" 
            color="light" 
            @click="isPayoutModalOpen = true"
            :disabled="!authStore.walletDetails?.balance"
          >
            {{ $t("common.buttons.transfer") }}
          </IonButton>
        </div>
      </IonCard>
    </SecondaryHeader>

    <IonContent class="ion-padding space-y-6">
      <div class="flex gap-4 items-center">
        <div class="ion-padding w-full rounded-2xl bg-success/20">
          <ArrowDown class="text-success mb-2" />
          <p class="text-success text-xl font-semibold mt-1">
            {{ $t("common.currencies.sar") }} {{ totalIncome }}
          </p>
          <p class="text-sm text-success">{{ $t("tailor.wallet.income") }}</p>
        </div>
        <div class="ion-padding w-full rounded-2xl bg-danger/20">
          <ArrowUp class="text-danger mb-2" />
          <p class="text-danger text-xl font-semibold mt-1">
            {{ $t("common.currencies.sar") }} {{ totalPayouts }}
          </p>
          <p class="text-sm text-danger">{{ $t("tailor.wallet.transfers") }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-lg font-semibold mb-4">
          {{ $t("tailor.wallet.recentTransaction") }}
        </p>
        <div v-if="transactions.length === 0" class="text-center py-10 text-muted-foreground">
          <p>No transactions found</p>
        </div>
        <IonCard
          v-for="trx in transactions"
          :key="trx.id"
          class="m-0 mb-4 ion-padding flex justify-between items-center"
        >
          <div class="flex gap-2 items-center">
            <ArrowDown
              v-if="trx.type === 'EARNING'"
              class="text-success bg-success/10 rounded-full p-1"
            />
            <ArrowUp v-else class="text-danger bg-danger/10 rounded-full p-1" />
            <div>
              <p class="font-semibold">
                {{
                  trx.type === "EARNING"
                    ? $t("tailor.wallet.payementRecieved")
                    : $t("tailor.wallet.transferSent")
                }}
              </p>
              <p class="text-xs font-light">{{ formatDate(trx.date) }}</p>
            </div>
          </div>
          <p
            class="font-semibold"
            :class="{
              'text-success': trx.type === 'EARNING',
              'text-danger': trx.type === 'PAYOUT',
            }"
          >
            {{ trx.type === "EARNING" ? "+" : "-" }}{{ trx.amount }}
            {{ $t("common.currencies.sar") }}
          </p>
        </IonCard>
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
            <p class="text-sm text-muted-foreground">
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
import {
  IonButton,
  IonCard,
  IonContent,
  IonPage,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { ArrowDown, ArrowUp } from "lucide-vue-next";
import { computed, ref, onMounted } from "vue";
import { SecondaryHeader } from "@/components";
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
    await authStore.requestPayout(payoutAmount.value);
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

<style scoped>
</style>
