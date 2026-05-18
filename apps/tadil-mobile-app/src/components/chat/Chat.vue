<template>
  <div class="flex flex-col h-full bg-background">
    <!-- Messages Area -->
    <div ref="messageContainer" class="flex-grow overflow-y-auto p-4 space-y-4">
      <div v-if="isLoading" class="flex justify-center py-4">
        <IonSpinner name="crescent" />
      </div>
      
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex flex-col max-w-[80%]"
        :class="msg.senderId === authStore.userId ? 'ml-auto items-end' : 'mr-auto items-start'"
      >
        <!-- Text Message -->
        <div
          v-if="msg.type === 'TEXT'"
          class="p-3 rounded-2xl shadow-sm"
          :class="msg.senderId === authStore.userId 
            ? 'bg-primary text-primary-contrast rounded-tr-none' 
            : 'bg-item text-main border border-main/10 rounded-tl-none'"
        >
          <p class="text-sm leading-relaxed">{{ msg.content }}</p>
        </div>

        <!-- Image Message -->
        <div
          v-else-if="msg.type === 'IMAGE'"
          class="rounded-2xl overflow-hidden border border-main/10 shadow-sm bg-item"
        >
          <img :src="msg.content" class="w-full h-auto max-h-60 object-cover" />
        </div>

        <!-- Audio Message -->
        <div
          v-else-if="msg.type === 'AUDIO'"
          class="w-full"
        >
          <ChatVoicePlayer :src="msg.content" :is-own="msg.senderId === authStore.userId" />
        </div>

        <span class="text-[10px] text-muted-foreground mt-1 px-1">
          {{ formatTime(msg.timestamp) }}
        </span>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-main/10 bg-item rounded-t-3xl shadow-lg">
      <div v-if="isRecording" class="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-semibold text-main">{{ $t("chat.recording") }}</span>
        </div>

        <div class="flex items-center gap-4">
          <button 
            class="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
            @click="cancelRecording"
          >
            <Trash2 class="h-6 w-6" />
          </button>
          <button 
            class="rounded-full bg-primary p-3 text-primary-contrast shadow-md active:scale-95 transition-transform" 
            @click="handleSendVoice"
          >
            <SendHorizonal class="h-6 w-6" />
          </button>
        </div>
      </div>

      <div v-else class="flex items-end gap-2">
        <div class="flex gap-1 mb-1">
          <button
            class="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
            @click="handlePickImage"
          >
            <ImageIcon class="h-6 w-6" />
          </button>
          <button
            class="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
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

        <button
          :disabled="!newMessage.trim()"
          class="mb-1 rounded-full bg-primary p-3 text-primary-contrast shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          @click="handleSendText"
        >
          <SendHorizonal class="h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { Mic, SendHorizonal, Trash2, Image as ImageIcon } from "lucide-vue-next";
import { IonSpinner } from "@ionic/vue";
import { useVoiceRecorder, useChat } from "@/composables";
import { useAuthStore } from "@/stores";
import ChatVoicePlayer from "./ChatVoicePlayer.vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const props = defineProps<{
  orderId: string;
  channel: 'TAILOR' | 'COURIER';
}>();

const authStore = useAuthStore();
const newMessage = ref("");
const messageContainer = ref<HTMLElement | null>(null);

const {
  messages,
  isLoading,
  fetchHistory,
  initSocket,
  sendMessage,
  sendMedia,
} = useChat(props.orderId, props.channel);

const {
  isRecording,
  startRecording,
  cancelRecording,
  stopAndGetBlob,
} = useVoiceRecorder();

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function handleSendText() {
  if (!newMessage.value.trim()) return;
  sendMessage(newMessage.value);
  newMessage.value = "";
}

async function handleSendVoice() {
  const audioBlob = await stopAndGetBlob();
  if (audioBlob) {
    const file = new File([audioBlob], `voice_${Date.now()}.m4a`, { type: 'audio/m4a' });
    await sendMedia(file, 'AUDIO');
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
      await sendMedia(file, 'IMAGE');
    }
  } catch (error) {
    console.error("Camera failed", error);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
}

watch(() => messages.value.length, scrollToBottom);

onMounted(async () => {
  await fetchHistory();
  initSocket();
  scrollToBottom();
});
</script>

<style scoped>
/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
