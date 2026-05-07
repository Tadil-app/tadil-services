<template>
  <div
    class="relative flex gap-4 p-4 rounded-xl border border-border bg-item text-main shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div class="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
      <ImageContainer
        :imageUrl="
          item.configuration.modelImages[0]?.imageUrl ||
          item.model.thumbnailImageUrl
        "
        :alt="item.model.englishName"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="flex flex-col grow min-w-0 justify-between">
      <div>
        <div class="flex justify-between items-start">
          <TranslatedName
            :names="item.model"
            class="text-xl font-bold truncate"
          />
          <button
            class="absolute top-4 end-4 p-1.5 text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-colors"
            @click.stop="$emit('remove', item.id)"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>

        <div class="mt-1 flex flex-wrap gap-2">
          <span
            class="px-2 py-0.5 text-xs bg-secondary/10 text-secondary rounded-full border border-secondary/20"
          >
            {{ alterationsCount }} {{ $t("cart.alterations") }}
          </span>
          <span
            class="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20"
          >
            {{ $t(`common.categories.${item.model.category}`) }}
          </span>
        </div>
      </div>

      <div class="mt-2 flex justify-between items-end">
        <div class="text-sm text-medium">
          <p v-if="imagesCount > 1">
            + {{ imagesCount - 1 }} {{ $t("cart.moreImages") }}
          </p>
        </div>
        <div class="text-lg font-bold text-tertiary">
          {{ itemPrice }} {{ $t("common.currencies.sar") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  CartItem,
  SelectedImage,
  SelectedSection,
} from "@/types/cart.types";
import { ImageContainer, TranslatedName } from "@/components";
import { Trash2 } from "lucide-vue-next";
import { calculateConfigurationPrice } from "@/utils";

const props = defineProps<{
  item: CartItem;
}>();

defineEmits<{
  (e: "remove", id: string): void;
}>();

const itemPrice = computed(() =>
  calculateConfigurationPrice(props.item.configuration),
);

const alterationsCount = computed(() => {
  return props.item.configuration.modelImages.reduce(
    (imageAcc: number, image: SelectedImage) => {
      const imageCount = image.sections.reduce(
        (sectionAcc: number, section: SelectedSection) => {
          return sectionAcc + section.alterations.length;
        },
        0,
      );
      return imageAcc + imageCount;
    },
    0,
  );
});

const imagesCount = computed(() => props.item.configuration.modelImages.length);
</script>
