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
        @touchstart="startPress(msg)"
        @touchend="endPress"
        @mousedown="startPress(msg)"
        @mouseup="endPress"
      >
        <!-- Deleted Message Placeholder -->
        <div
          v-if="msg.deletedAt"
          class="p-3 rounded-2xl border border-main/10 bg-step-50 text-muted-foreground italic flex items-center gap-2"
          :class="msg.senderId === authStore.userId ? 'rounded-tr-none' : 'rounded-tl-none'"
        >
          <Trash2 class="w-3 h-3 opacity-50" />
          <p class="text-xs">{{ $t("chat.messageDeleted") }}</p>
        </div>

        <template v-else>
          <!-- Text Message -->
          <div
            v-if="msg.type === 'TEXT'"
            class="p-3 rounded-2xl shadow-sm relative"
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
            <ChatVoicePlayer 
              :src="msg.content" 
              :is-own="msg.senderId === authStore.userId" 
              :provided-duration="msg.metadata?.duration"
            />
          </div>
        </template>

        <span class="text-[10px] text-muted-foreground mt-1 px-1">
          {{ formatTime(msg.timestamp) }}<span v-if="msg.isEdited"> - {{ $t("chat.edited") }}</span>
        </span>
      </div>

      <!-- Media Uploading Placeholder -->
      <div
        v-if="uploadingMediaType"
        class="flex flex-col max-w-[80%] ml-auto items-end animate-pulse"
      >
        <div class="p-4 rounded-2xl shadow-sm bg-primary/50 text-primary-contrast rounded-tr-none flex items-center gap-2">
          <IonSpinner name="dots" color="light" />
          <p class="text-xs">
            {{ uploadingMediaType === 'IMAGE' ? $t("chat.sendingImage") : $t("chat.sendingAudio") }}
          </p>
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
import { IonSpinner, IonButton, alertController } from "@ionic/vue";
import { useChat, ChatMessage } from "@/composables";
import { useAuthStore } from "@/stores";
import { ChevronDown, Trash2 } from "lucide-vue-next";
import ChatVoicePlayer from "./ChatVoicePlayer.vue";
import ChatInput from "./ChatInput.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  orderId: string;
  channel: 'TAILOR' | 'COURIER';
}>();

const { t } = useI18n();

const authStore = useAuthStore();
const messageContainer = ref<HTMLElement | null>(null);
const showNewMessageIndicator = ref(false);

const {
  messages,
  isLoading,
  uploadingMediaType,
  fetchHistory,
  initSocket,
  sendMessage,
  deleteMessage,
  editMessage,
  sendMedia,
} = useChat(props.orderId, props.channel);

// Long Press Support
let pressTimer: any = null;
function startPress(msg: ChatMessage) {
  if (msg.senderId !== authStore.userId || msg.deletedAt) return;

  pressTimer = setTimeout(() => {
    presentMessageActions(msg);
  }, 600);
}

function endPress() {
  clearTimeout(pressTimer);
}

async function presentMessageActions(msg: ChatMessage) {
  const alert = await alertController.create({
    header: t("chat.messageOptions"),
    cssClass: "section-alert",
    buttons: [
      {
        text: t("common.buttons.cancel"),
        role: "cancel",
        cssClass: "btn-cancel",
      },
      ...(msg.type === "TEXT"
        ? [
            {
              text: t("chat.edit"),
              cssClass: "btn-add",
              handler: () => presentEditPrompt(msg),
            },
          ]
        : []),
      {
        text: t("chat.delete"),
        cssClass: "btn-remove",
        handler: () => deleteMessage(msg.id),
      },
    ],
  });
  await alert.present();
}

async function presentEditPrompt(msg: ChatMessage) {
  const alert = await alertController.create({
    header: t("chat.editMessage"),
    cssClass: "section-alert",
    inputs: [
      {
        name: "content",
        type: "textarea",
        value: msg.content,
        placeholder: t("chat.placeholder"),
      },
    ],
    buttons: [
      {
        text: t("common.buttons.cancel"),
        role: "cancel",
        cssClass: "btn-cancel",
      },
      {
        text: t("common.buttons.save"),
        cssClass: "btn-add",
        handler: (data) => {
          if (data.content?.trim() && data.content !== msg.content) {
            editMessage(msg.id, data.content);
          }
        },
      },
    ],
  });
  await alert.present();
}

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

async function handleSendMedia(file: File, type: 'IMAGE' | 'AUDIO', metadata?: any) {
  await sendMedia(file, type, metadata);
}

watch([() => messages.value.length, uploadingMediaType], ([newLen, uploading], [oldLen, oldUploading]) => {
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
