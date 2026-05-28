<template>
  <div class="p-4 border-t border-main/10 bg-item rounded-t-3xl shadow-lg" dir="ltr">
    <!-- Recording State -->
    <div v-if="isRecording" class="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm font-semibold text-main">{{ $t("chat.recording") }}</span>
      </div>

      <div class="flex items-center gap-2">
        <IonButton 
          fill="clear"
          color="danger"
          shape="round"
          class="m-0"
          style="width: 36px; height: 36px;"
          @click="cancelRecording"
        >
          <Trash2 class="h-5 w-5" slot="icon-only" />
        </IonButton>
        <IonButton 
          color="primary"
          shape="round"
          size="small"
          class="m-0 shadow-md"
          style="--padding-start: 0; --padding-end: 0; width: 36px; height: 36px;"
          @click="handleSendVoice"
        >
          <SendHorizonal class="h-5 w-5" />
        </IonButton>
      </div>
    </div>

    <!-- Default State (Text, Image, Mic) -->
    <div v-else class="flex items-center gap-2">
      <div class="flex gap-2">
        <button
          class="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
          @click="handlePickImage"
        >
          <ImageIcon class="h-6 w-6" />
        </button>
        <button
          class="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
          @click="startRecording"
        >
          <Mic class="h-6 w-6" />
        </button>
      </div>

      <textarea
        v-model="newMessage"
        rows="1"
        :placeholder="$t('chat.placeholder')"
        class="flex-grow p-2.5 max-h-32 rounded-2xl bg-background border border-primary/20 focus:border-primary outline-none text-main resize-none transition-all"
        @keydown.enter.prevent="handleSendText"
      ></textarea>

      <IonButton
        :disabled="!newMessage.trim()"
        color="primary"
        shape="round"
        size="small"
        class="m-0 shadow-md active:scale-95 transition-all"
        style="--padding-start: 0; --padding-end: 0; width: 36px; height: 36px;"
        @click="handleSendText"
      >
        <SendHorizonal class="h-5 w-5" />
      </IonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Mic, SendHorizonal, Trash2, Image as ImageIcon } from "lucide-vue-next";
import { useVoiceRecorder } from "@/composables";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { IonButton } from "@ionic/vue";

const emit = defineEmits<{
  (e: 'send-text', text: string): void;
  (e: 'send-file', file: File, type: 'IMAGE' | 'AUDIO', metadata?: any): void;
}>();

const newMessage = ref("");

const {
  isRecording,
  recordingDuration,
  startRecording,
  cancelRecording,
  stopAndGetBlob,
} = useVoiceRecorder();

function handleSendText() {
  if (!newMessage.value.trim()) return;
  emit('send-text', newMessage.value);
  newMessage.value = "";
}

async function handleSendVoice() {
  const audioBlob = await stopAndGetBlob();
  if (audioBlob) {
    const file = new File([audioBlob], `voice_${Date.now()}.m4a`, { type: 'audio/m4a' });
    emit('send-file', file, 'AUDIO', { duration: recordingDuration.value });
  }
}

async function handlePickImage() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    if (image.webPath) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], `image_${Date.now()}.${image.format}`, { type: blob.type });
      emit('send-file', file, 'IMAGE');
    }
  } catch (error) {
    console.error("Camera failed", error);
  }
}
</script>
