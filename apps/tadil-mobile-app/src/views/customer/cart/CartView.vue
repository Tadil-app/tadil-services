<template>
  <IonPage>
    <SecondaryHeader :title="$t('cart.title')" :show-back-button="false" />

    <IonContent class="ion-padding cart-content">
      <EmptyState v-if="cartStore.itemsCount === 0" :icon="ShoppingBag" :title="$t('cart.emptyTitle')" :description="$t('cart.emptyDescription')">
        <IonButton fill="solid" color="primary" shape="round" class="px-8" router-link="/customer/new-order">
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

    <IonFooter v-if="cartStore.itemsCount > 0" class="cart-footer">
      <div class="cart-footer__content">
        <div class="cart-summary">
          <div class="cart-summary__row">
            <p>{{ $t("cart.itemsCount") }}</p>
            <strong>{{ cartStore.itemsCount }}</strong>
          </div>
          <div class="cart-summary__row cart-summary__total">
            <p>{{ $t("cart.totalPrice") }}</p>
            <strong> {{ cartStore.totalPrice }} {{ $t("common.currencies.sar") }} </strong>
          </div>
        </div>

        <div class="cart-actions">
          <IonButton fill="outline" color="primary" @click="confirmClearCart">
            {{ $t("cart.clearAll") }}
          </IonButton>
          <IonButton fill="solid" color="primary" router-link="/customer/checkout">
            {{ $t("cart.checkout") }}
          </IonButton>
        </div>
      </div>
    </IonFooter>
  </IonPage>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonFooter, IonPage, alertController } from "@ionic/vue";
import { ShoppingBag } from "lucide-vue-next";
import { useCartStore } from "@/stores";
import CartItem from "./components/CartItem.vue";
import { useRouter } from "vue-router";
import { SecondaryHeader, EmptyState } from "@/components";
import { useI18n } from "vue-i18n";

const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();

async function confirmClearCart() {
  const alert = await alertController.create({
    header: t("cart.clearAll"),
    message: t("cart.clearConfirmMessage"),
    cssClass: "section-alert",
    buttons: [
      {
        text: t("common.buttons.cancel"),
        role: "cancel",
        cssClass: "btn-cancel",
      },
      {
        text: t("cart.clearAll"),
        cssClass: "btn-remove",
        handler: () => {
          cartStore.clearCart();
        },
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.cart-content {
  --padding-bottom: 24px;
}

.cart-footer {
  border-top: 1px solid #f1e5e2;
  background: #fffaf6;
}

.cart-footer__content {
  display: grid;
  gap: 16px;
  padding: 18px 16px 20px;
}

.cart-summary {
  overflow: hidden;
  border: 1px solid #c87082;
  border-radius: 16px;
  background: #fff5f6;
}

.cart-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  color: var(--ion-color-primary);
}

.cart-summary__row + .cart-summary__row {
  border-top: 1px solid #e5bec6;
}

.cart-summary__row p,
.cart-summary__row strong {
  margin: 0;
}

.cart-summary__row strong {
  font-size: 18px;
}

.cart-summary__total p,
.cart-summary__total strong {
  font-size: 21px;
  font-weight: 800;
}

.cart-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.cart-actions ion-button {
  --border-radius: 13px;
  min-height: 52px;
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}
</style>
