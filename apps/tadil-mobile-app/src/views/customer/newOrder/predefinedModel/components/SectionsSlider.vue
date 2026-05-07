<template>
  <div class="relative h-6 flex items-center w-full overflow-hidden px-2">
    <div
      v-if="!isBeginning"
      class="absolute start-0 rtl:rotate-180 z-20 pointer-events-none bg-linear-to-r from-white to-transparent -m-2"
    >
      <ChevronLeft />
    </div>
    <div
      v-if="!isEnd"
      class="absolute end-0 rtl:rotate-180 z-20 pointer-events-none bg-linear-to-l from-white to-transparent -m-2"
    >
      <ChevronRight />
    </div>
    <Swiper
      :dir="direction"
      class="w-full px-2"
      slidesPerView="auto"
      :spaceBetween="8"
      :freeMode="true"
      :modules="[FreeMode]"
      @progress="handleSwiperProgress"
      @reachBeginning="isBeginning = true"
      @reachEnd="isEnd = true"
      @fromEdge="handleFromEdge"
    >
      <SwiperSlide
        v-for="section in sections"
        :key="section.id"
        class="max-w-fit"
      >
        <SectionsSliderItem :section="section" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { DisplaySectionDTO } from "@/integration/dtos";
import SectionsSliderItem from "./SectionsSliderItem.vue";

defineProps<{
  direction: "ltr" | "rtl";
  sections: DisplaySectionDTO[];
}>();

const isBeginning = ref(true);
const isEnd = ref(true);
const handleSwiperProgress = (swiper: SwiperType) => {
  if (swiper.isLocked) {
    isBeginning.value = true;
    isEnd.value = true;
    return;
  }

  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.isEnd;
};

const handleFromEdge = () => {
  isBeginning.value = false;
  isEnd.value = false;
};
</script>
