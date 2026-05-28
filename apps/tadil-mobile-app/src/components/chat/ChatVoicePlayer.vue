<template>
  <div 
    class="flex items-center gap-3 p-3 rounded-2xl border border-main/10 shadow-sm"
    :class="isOwn ? 'bg-primary/5 ml-auto' : 'bg-item mr-auto'"
    dir="ltr"
  >
    <IonButton 
      shape="round"
      size="small"
      class="m-0 shadow-sm"
      :color="isPlaying ? 'primary' : 'tertiary'"
      style="--padding-start: 0; --padding-end: 0; width: 36px; height: 36px;"
      @click="togglePlay"
    >
      <Pause v-if="isPlaying" class="w-4 h-4 fill-current" />
      <Play v-else class="w-4 h-4 fill-current ml-0.5" />
    </IonButton>

    <div class="grow min-w-30">
      <!-- Progress Bar -->
      <div class="h-1.5 w-full bg-main/10 rounded-full overflow-hidden">
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
import { IonButton } from '@ionic/vue';

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
