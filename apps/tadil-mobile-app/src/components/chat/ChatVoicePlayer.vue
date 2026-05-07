<template>
  <div
    class="flex items-center gap-3 bg-main/5 border border-main/10 p-3 rounded-2xl w-full max-w-70"
  >
    <button
      @click="togglePlay"
      class="text-primary p-2 flex items-center justify-center transition-transform active:scale-90"
    >
      <Play v-if="!isPlaying" class="h-5 w-5 fill-current" />
      <Pause v-else class="h-5 w-5 fill-current" />
    </button>
    <div class="flex flex-col flex-1 gap-1">
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.01"
        :value="currentTime"
        @input="onSeek"
        class="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div class="flex justify-between text-xs">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Play, Pause } from "lucide-vue-next";

const props = defineProps<{
  src: string;
}>();

const audio = new Audio(props.src);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const togglePlay = () => {
  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.play();
  }
};

const onSeek = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const time = parseFloat(target.value);
  audio.currentTime = time;
  currentTime.value = time;
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Listeners
onMounted(() => {
  audio.addEventListener(
    "loadedmetadata",
    () => (duration.value = audio.duration),
  );
  audio.addEventListener(
    "timeupdate",
    () => (currentTime.value = audio.currentTime),
  );
  audio.addEventListener("play", () => (isPlaying.value = true));
  audio.addEventListener("pause", () => (isPlaying.value = false));
  audio.addEventListener("ended", () => {
    isPlaying.value = false;
    currentTime.value = 0;
  });
});

onUnmounted(() => {
  audio.pause();
  audio.src = "";
  audio.load();
});

// If the src changes (e.g., new recording)
watch(
  () => props.src,
  (newSrc) => {
    audio.src = newSrc;
    audio.load();
  },
);
</script>

<style scoped>
/* Custom styling to make the range slider look cleaner */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--ion-color-primary, #3880ff);
  border-radius: 50%;
  cursor: pointer;
}
</style>
