<template>
  <div class="cart-item">
    <div class="cart-item__image">
      <ImageContainer :imageUrl="item.configuration.modelImages[0]?.imageUrl || item.model.thumbnailImageUrl" :alt="item.model.englishName" class="w-full h-full object-cover" />
    </div>

    <div class="cart-item__content">
      <TranslatedName :names="item.model" class="cart-item__title" />
      <button class="cart-item__remove" :aria-label="$t('cart.clearAll')" @click.stop="$emit('remove', item.id)">
        <Trash2 />
      </button>

      <div class="cart-item__tags">
        <span>{{ alterationsCount }} {{ $t("cart.alterations") }}</span>
        <span>{{ $t(`common.categories.${item.model.category}`) }}</span>
      </div>

      <p v-if="imagesCount > 1" class="cart-item__more">+ {{ imagesCount - 1 }} {{ $t("cart.moreImages") }}</p>
      <strong class="cart-item__price"> {{ itemPrice }} {{ $t("common.currencies.sar") }} </strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CartItem, SelectedImage, SelectedSection } from "@/types/cart.types";
import { ImageContainer, TranslatedName } from "@/components";
import { Trash2 } from "lucide-vue-next";
import { calculateConfigurationPrice } from "@/utils";

const props = defineProps<{
  item: CartItem;
}>();

defineEmits<{
  (e: "remove", id: string): void;
}>();

const itemPrice = computed(() => calculateConfigurationPrice(props.item.configuration));

const alterationsCount = computed(() => {
  return props.item.configuration.modelImages.reduce((imageAcc: number, image: SelectedImage) => {
    const imageCount = image.sections.reduce((sectionAcc: number, section: SelectedSection) => {
      return sectionAcc + section.alterations.length;
    }, 0);
    return imageAcc + imageCount;
  }, 0);
});

const imagesCount = computed(() => props.item.configuration.modelImages.length);
</script>

<style scoped>
.cart-item {
  position: relative;
  display: grid;
  grid-template-columns: 116px 1fr;
  gap: 16px;
  min-height: 142px;
  padding: 14px;
  overflow: hidden;
  border: 1px solid #ead7d4;
  border-radius: 18px;
  background: #fffdfb;
  box-shadow: 0 4px 10px rgba(109, 15, 47, 0.09);
}

.cart-item__image {
  width: 116px;
  height: 116px;
  overflow: hidden;
  border-radius: 12px;
  background: #fae9ec;
}

.cart-item__content {
  position: relative;
  display: grid;
  min-width: 0;
  padding-inline-end: 38px;
}

.cart-item__title {
  overflow: hidden;
  color: var(--ion-color-primary);
  font-size: 20px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item__remove {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  place-items: center;
  color: var(--ion-color-primary);
  background: #fae9ec;
}

.cart-item__remove svg {
  width: 21px;
  height: 21px;
}

.cart-item__tags {
  display: flex;
  align-items: start;
  align-self: start;
  flex-wrap: wrap;
  gap: 8px;
}

.cart-item__tags span {
  padding: 2px 10px;
  border: 1px solid #e8bfc8;
  border-radius: 999px;
  color: var(--ion-color-primary);
  background: #fff5f6;
  font-size: 12px;
}

.cart-item__more {
  align-self: end;
  color: var(--ion-step-350);
  font-size: 12px;
}

.cart-item__price {
  position: absolute;
  inset-inline-end: 0;
  inset-block-end: 0;
  color: var(--ion-color-primary);
  font-size: 18px;
}

@media (max-width: 370px) {
  .cart-item {
    grid-template-columns: 94px 1fr;
    gap: 12px;
  }

  .cart-item__image {
    width: 94px;
    height: 108px;
  }
}
</style>
