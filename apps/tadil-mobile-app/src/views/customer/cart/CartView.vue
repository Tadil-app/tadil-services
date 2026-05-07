<template>
  <IonPage>
    <SecondaryHeader :title="$t('cart.title')" :show-back-button="false" />

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

      <div v-else class="space-y-4">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @click="
            router.push({
              name: 'customer-cart-item-details',
              params: { itemId: item.id },
            })
          "
          @remove="cartStore.removeItem"
        />
      </div>
    </IonContent>

    <IonFooter
      v-if="cartStore.itemsCount > 0"
      class="ion-padding bg-background border-t border-primary/10"
    >
      <div class="space-y-4">
        <div
          class="p-4 rounded-xl border border-primary bg-primary/5 divide-y divide-primary/20"
        >
          <div class="flex justify-between items-center py-1">
            <p class="text-medium">{{ $t("cart.itemsCount") }}</p>
            <p class="text-lg font-semibold">{{ cartStore.itemsCount }}</p>
          </div>
          <div class="flex justify-between items-center py-1 mt-2 pt-2">
            <p class="text-lg font-bold">{{ $t("cart.totalPrice") }}</p>
            <p class="text-2xl text-tertiary font-extrabold">
              {{ cartStore.totalPrice }} {{ $t("common.currencies.sar") }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pb-4">
          <IonButton
            fill="outline"
            color="secondary"
            shape="round"
            @click="cartStore.clearCart"
          >
            {{ $t("cart.clearAll") }}
          </IonButton>
          <IonButton fill="solid" color="tertiary" shape="round">
            {{ $t("cart.checkout") }}
          </IonButton>
        </div>
      </div>
    </IonFooter>
  </IonPage>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonFooter, IonPage } from "@ionic/vue";
import { ShoppingBag } from "lucide-vue-next";
import { useCartStore } from "@/stores";
import CartItem from "./components/CartItem.vue";
import { useRouter } from "vue-router";
import { SecondaryHeader, EmptyState } from "@/components";

const cartStore = useCartStore();
const router = useRouter();
</script>

<style scoped>
ion-toolbar {
  --background: linear-gradient(to right, #4f46e5, #9333ea);
  --color: white;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  --min-height: 80px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}
</style>
