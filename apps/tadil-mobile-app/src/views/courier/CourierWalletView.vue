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
          <p class="text-4xl font-bold">0.00 <span class="text-xl font-normal">{{ $t('common.currencies.sar') }}</span></p>
        </IonCard>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <IonCard class="m-0 ion-padding">
            <IonLabel class="text-xs text-muted-foreground block mb-1">
              {{ $t('tailor.wallet.income') }}
            </IonLabel>
            <p class="font-bold">0.00 SAR</p>
          </IonCard>
          <IonCard class="m-0 ion-padding">
            <IonLabel class="text-xs text-muted-foreground block mb-1">
              {{ $t('tailor.wallet.transfers') }}
            </IonLabel>
            <p class="font-bold">0.00 SAR</p>
          </IonCard>
        </div>

        <!-- Transactions -->
        <div>
          <h2 class="text-lg font-bold mb-3">{{ $t('tailor.wallet.recentTransaction') }}</h2>
          <IonCard class="m-0">
            <div class="text-center py-10 text-muted-foreground">
              <p>No recent transactions</p>
            </div>
          </IonCard>
        </div>
      </div>
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
} from "@ionic/vue";
</script>
