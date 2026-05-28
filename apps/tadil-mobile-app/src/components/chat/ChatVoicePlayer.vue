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
    
    <audio ref="audioPlayer" :src="src" preload="auto" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="onEnded" class="hidden"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, onMounted } from 'vue';
import { Play, Pause } from 'lucide-vue-next';
import { IonButton } from '@ionic/vue';

const props = defineProps<{
  src: string;
  isOwn?: boolean;
  providedDuration?: number;
}>();

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(props.providedDuration || 0);

watch(() => props.src, () => {
  duration.value = props.providedDuration || 0;
  currentTime.value = 0;
  progress.value = 0;
  isPlaying.value = false;
});

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
  
  // Update duration if it's still 0 and browser resolved it
  if (duration.value === 0 && isFinite(audioPlayer.value.duration)) {
    duration.value = audioPlayer.value.duration;
  }
  
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100;
  }
}

function onLoadedMetadata() {
  if (isFinite(audioPlayer.value?.duration || NaN) && !duration.value) {
    duration.value = audioPlayer.value!.duration;
  }
}

function onEnded() {
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = 0;
}

function formatTime(seconds: number) {
  if (!isFinite(seconds) || isNaN(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

onMounted(() => {
  if (props.providedDuration) {
    duration.value = props.providedDuration;
  }
});

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
});
</script>
