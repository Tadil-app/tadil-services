<template>
  <div>
    <Button variant="outline" size="icon-sm" @click.stop="openModal">
      <TabletSmartphone class="h-4 w-4" />
    </Button>
    <Teleport to="body">
      <Modal v-model="isOpen">
        <div
          v-if="selectedModelImage"
          class="mobile-preview-container space-y-2"
        >
          <div
            class="flex h-10 gap-2 p-1 overflow-x-auto border-y border-border"
          >
            <button
              v-for="section in selectedModelImageSections"
              :key="section.id"
              class="flex w-fit justify-between items-center gap-1 px-2 py-0.5 bg-primary/70 rounded-full"
              @click="selectModelImageSection(section.coordinates)"
            >
              <p class="whitespace-nowrap">{{ section.name }}</p>
              <button
                v-if="selectedModelImageSection === section.coordinates"
                @click.stop="unselectModelImageSection()"
              >
                <X class="h-3 w-3" />
              </button>
            </button>
          </div>
          <MobilePreviewImageSegmenter
            :imageBase64String="selectedModelImage?.imageBase64String"
            :sections="[selectedModelImageSection]"
          />
          <div class="flex gap-2 p-1 overflow-auto">
            <button
              v-for="image in modelImages"
              :key="image.id"
              class="w-40 h-40 flex justify-center items-center border border-border rounded-md"
              @click="selectModelImage(image)"
            >
              <img
                :src="image.imageBase64String"
                class="max-w-40 max-h-40 h-auto rounded-md"
              />
            </button>
          </div>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from "@/components";
import { useTranslatedNamesComposable } from "@/composables";
import {
  apiClient,
  type DisplayModelDTO,
  type DisplayModelImageDTO,
  type Point,
} from "@/integration";
import { TabletSmartphone, X } from "lucide-vue-next";
import { computed, ref } from "vue";
import MobilePreviewImageSegmenter from "./MobilePreviewImageSegmenter.vue";

const isOpen = ref<boolean>(false);
async function openModal() {
  await getModelImages();
  isOpen.value = true;
}

const props = defineProps<{
  model: DisplayModelDTO;
}>();

const modelImages = ref<DisplayModelImageDTO[]>([]);
const selectedModelImage = ref<DisplayModelImageDTO>();
function selectModelImage(image: DisplayModelImageDTO) {
  selectedModelImage.value = image;
  selectedModelImageSection.value = [];
}
const selectedModelImageSections = computed(() =>
  selectedModelImage.value?.sections.map((section) => ({
    id: section.id,
    name: useTranslatedNamesComposable(section).translatedName,
    coordinates: section.coordinates,
  }))
);
const selectedModelImageSection = ref<Point[]>([]);
function selectModelImageSection(section: Point[]) {
  selectedModelImageSection.value = section;
}
function unselectModelImageSection() {
  selectedModelImageSection.value = [];
}

async function getModelImages() {
  modelImages.value = [];
  modelImages.value = (
    await apiClient.modelsControllerGetModelImages(props.model.id)
  ).data;
  if (modelImages.value.length === 0) {
    selectedModelImage.value = undefined;
    return;
  }
  const selectedModelImageIndex = modelImages.value.findIndex(
    (image) => image.id === selectedModelImage.value?.id
  );
  if (selectedModelImageIndex === -1) {
    selectedModelImage.value = modelImages.value[0];
    return;
  } else {
    selectedModelImage.value = modelImages.value[selectedModelImageIndex];
    return;
  }
}
</script>

<style scoped>
.mobile-preview-container {
  width: 375px;
  height: 667px;
  border: 10px solid #333;
  border-radius: 40px;
  overflow: auto;
  margin: 20px auto;
  padding: 80px 0px 0px 0px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.mobile-preview-container::-webkit-scrollbar,
.mobile-preview-container > *::-webkit-scrollbar {
  display: none;
}
</style>
