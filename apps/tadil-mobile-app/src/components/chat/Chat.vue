<template>
  <div class="flex flex-col h-full bg-background relative" dir="ltr">
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

      <!-- Media Uploading Placeholder -->
      <div
        v-if="isUploadingMedia"
        class="flex flex-col max-w-[80%] ml-auto items-end animate-pulse"
      >
        <div class="p-4 rounded-2xl shadow-sm bg-primary/50 text-primary-contrast rounded-tr-none flex items-center gap-2">
          <IonSpinner name="dots" color="light" />
          <p class="text-xs">{{ $t("chat.recording") }}</p>
        </div>
      </div>
    </div>

    <!-- New Message Indicator -->
    <div 
      v-if="showNewMessageIndicator"
      class="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <IonButton 
        color="tertiary"
        shape="round"
        size="small"
        class="shadow-lg active:scale-95 transition-transform"
        style="--padding-start: 24px; --padding-end: 24px; height: 36px;"
        @click="scrollToBottom"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider">{{ $t("chat.newMessage") }}</span>
          <ChevronDown class="w-4 h-4 animate-bounce" />
        </div>
      </IonButton>
    </div>

    <!-- Reusable Input Area -->
    <ChatInput 
      @send-text="handleSendMessage" 
      @send-file="handleSendMedia"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { IonSpinner, IonButton } from "@ionic/vue";
import { useChat } from "@/composables";
import { useAuthStore } from "@/stores";
import { ChevronDown } from "lucide-vue-next";
import ChatVoicePlayer from "./ChatVoicePlayer.vue";
import ChatInput from "./ChatInput.vue";

const props = defineProps<{
  orderId: string;
  channel: 'TAILOR' | 'COURIER';
}>();

const authStore = useAuthStore();
const messageContainer = ref<HTMLElement | null>(null);
const showNewMessageIndicator = ref(false);

const {
  messages,
  isLoading,
  isUploadingMedia,
  fetchHistory,
  initSocket,
  sendMessage,
  sendMedia,
} = useChat(props.orderId, props.channel);

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTo({
        top: messageContainer.value.scrollHeight,
        behavior: 'smooth'
      });
      showNewMessageIndicator.value = false;
    }
  });
}
function handleSendMessage(text: string) {
  sendMessage(text);
}

async function handleSendMedia(file: File, type: 'IMAGE' | 'AUDIO') {
  await sendMedia(file, type);
}

watch([() => messages.value.length, isUploadingMedia], ([newLen, uploading], [oldLen, oldUploading]) => {
  // 1. If we just started uploading media, scroll to show the spinner
  if (uploading && !oldUploading) {
    scrollToBottom();
    return;
  }

  // 2. If a new message arrived
  if (newLen > (oldLen || 0) && oldLen > 0) {
    const lastMsg = messages.value[newLen - 1];

    // If it's our own message (the echo), scroll to it
    if (lastMsg.senderId === authStore.userId) {
      scrollToBottom();
    } else {
      // If it's someone else's message, show the alert
      showNewMessageIndicator.value = true;
    }
  }
});

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
