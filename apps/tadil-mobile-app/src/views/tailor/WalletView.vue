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
            {{ $t("common.currencies.sar") }} 300
          </p>
          <IonButton expand="block" color="light">{{
            $t("common.buttons.transfer")
          }}</IonButton>
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
            {{ $t("common.currencies.sar") }} {{ totalTransfers }}
          </p>
          <p class="text-sm text-danger">{{ $t("tailor.wallet.transfers") }}</p>
        </div>
      </div>
      <div class="space-y-4">
        <p class="text-lg font-semibold mb-4">
          {{ $t("tailor.wallet.recentTransaction") }}
        </p>
        <IonCard
          v-for="trx in transactions"
          :key="trx.reference"
          class="ion-padding flex justify-between items-center"
        >
          <div class="flex gap-2 items-center">
            <ArrowDown
              v-if="trx.direction === 'recieved'"
              class="text-success bg-success/10 rounded-full"
            />
            <ArrowUp v-else class="text-danger bg-danger/10 rounded-full" />
            <div>
              <p class="font-semibold">
                {{
                  trx.direction === "recieved"
                    ? $t("tailor.wallet.payementRecieved")
                    : $t("tailor.wallet.transferSent")
                }}
              </p>
              <p class="text-xs font-light">{{ trx.date }}</p>
            </div>
          </div>
          <p
            class="font-semibold"
            :class="{
              'text-success': trx.direction === 'recieved',
              'text-danger': trx.direction === 'sent',
            }"
          >
            {{ trx.direction === "recieved" ? "+" : "-" }}{{ trx.amount }}
            {{ $t("common.currencies.sar") }}
          </p>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonContent,
  IonPage,
} from "@ionic/vue";
import { ArrowDown, ArrowUp } from "lucide-vue-next";
import { computed, ref } from "vue";
import { SecondaryHeader } from "@/components";

const transactions = ref([
  {
    reference: "TXN123456",
    date: "27/12/2024",
    amount: 250.0,
    direction: "recieved",
  },
  {
    reference: "TXN123457",
    date: "25/12/2024",
    amount: 150.0,
    direction: "sent",
  },
  {
    reference: "TXN123458",
    date: "20/12/2024",
    amount: 300.0,
    direction: "recieved",
  },
  {
    reference: "TXN123459",
    date: "18/12/2024",
    amount: 100.0,
    direction: "sent",
  },
  // Add more transactions as needed
]);

const totalIncome = computed(() =>
  transactions.value
    .filter((txn) => txn.direction === "recieved")
    .reduce((sum, txn) => sum + txn.amount, 0),
);
const totalTransfers = computed(() =>
  transactions.value
    .filter((txn) => txn.direction === "sent")
    .reduce((sum, txn) => sum + txn.amount, 0),
);
</script>

<style scoped>
</style>
