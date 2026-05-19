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

    <!-- Reusable Input Area -->
    <ChatInput 
      @send-text="sendMessage" 
      @send-file="sendMedia"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { IonSpinner } from "@ionic/vue";
import { useChat } from "@/composables";
import { useAuthStore } from "@/stores";
import ChatVoicePlayer from "./ChatVoicePlayer.vue";
import ChatInput from "./ChatInput.vue";

const props = defineProps<{
  orderId: string;
  channel: 'TAILOR' | 'COURIER';
}>();

const authStore = useAuthStore();
const messageContainer = ref<HTMLElement | null>(null);

const {
  messages,
  isLoading,
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
