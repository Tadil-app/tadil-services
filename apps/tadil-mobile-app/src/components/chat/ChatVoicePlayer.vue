<template>
  <div 
    class="flex items-center gap-3 p-3 rounded-2xl border border-main/10 shadow-sm"
    :class="isOwn ? 'bg-primary/5 ml-auto' : 'bg-item mr-auto'"
  >
    <button 
      class="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
      :class="isPlaying ? 'bg-primary text-primary-contrast' : 'bg-tertiary text-tertiary-contrast'"
      @click="togglePlay"
    >
      <Pause v-if="isPlaying" class="w-5 h-5" />
      <Play v-else class="w-5 h-5 fill-current ml-0.5" />
    </button>

    <div class="flex-grow min-w-[120px]">
      <!-- Progress Bar -->
      <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-100"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
      <div class="flex justify-between mt-1">
        <span class="text-[9px] font-mono text-muted-foreground">{{ formatTime(currentTime) }}</span>
        <span class="text-[9px] font-mono text-muted-foreground">{{ formatTime(duration) }}</span>
      </div>
    </div>
    
    <audio ref="audioPlayer" :src="src" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="onEnded" class="hidden"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { Play, Pause } from 'lucide-vue-next';

const props = defineProps<{
  src: string;
  isOwn?: boolean;
}>();

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);

function togglePlay() {
  if (!audioPlayer.value) return;
  
  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play();
  }
  isPlaying.value = !isPlaying.value;
}

function onTimeUpdate() {
  if (!audioPlayer.value) return;
  currentTime.value = audioPlayer.value.currentTime;
  progress.value = (currentTime.value / duration.value) * 100;
}

function onLoadedMetadata() {
  if (!audioPlayer.value) return;
  duration.value = audioPlayer.value.duration;
}

function onEnded() {
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = 0;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
});
</script>
