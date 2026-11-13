import { ref, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/integration/api';
import { useI18n } from 'vue-i18n';
import { useToast } from './useToast.composable';

/**
 * Each order has up to three chats:
 * - TAILOR: client and tailor
 * - COURIER: client and driver
 * - TAILOR_COURIER: tailor and driver
 */
export type ChatChannel = 'TAILOR' | 'COURIER' | 'TAILOR_COURIER';

const SEND_TIMEOUT_MS = 10_000;

export interface ChatMessage {
  id: string;
  senderId: string;
  type: 'TEXT' | 'IMAGE' | 'AUDIO';
  content: string;
  timestamp: string;
  metadata?: any;
  deletedAt?: string;
  isEdited?: boolean;
}

export function useChat(orderId: string, channel: ChatChannel) {
  const authStore = useAuthStore();
  const { t } = useI18n();
  const { showToast } = useToast();
  const socket = ref<Socket | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const isConnected = ref(false);
  const isLoading = ref(false);
  const uploadingMediaType = ref<'IMAGE' | 'AUDIO' | null>(null);

  async function fetchHistory() {
    isLoading.value = true;
    try {
      const response = await apiClient.chatControllerGetMessages(orderId, channel);
      messages.value = response.data;
    } catch (error) {
      console.error('Failed to fetch chat history', error);
    } finally {
      isLoading.value = false;
    }
  }

  function initSocket() {
    if (socket.value) return;

    socket.value = io(import.meta.env.VITE_TADIL_MOBILE_API_URL, {
      auth: {
        token: authStore.token,
      },
    });

    let hasConnectedBefore = false;
    socket.value.on('connect', async () => {
      isConnected.value = true;
      try {
        await socket.value?.timeout(SEND_TIMEOUT_MS).emitWithAck('joinOrderChat', { orderId, channel });
      } catch (error) {
        console.error('Failed to join chat', error);
      }
      // After a reconnect (app back from background, network change), pull
      // the messages sent while this phone was offline.
      if (hasConnectedBefore) {
        await fetchHistory();
      }
      hasConnectedBefore = true;
    });

    socket.value.on('newMessage', (message: ChatMessage) => {
      if (messages.value.some((m) => m.id === message.id)) return;
      messages.value.push(message);
    });

    socket.value.on('exception', (error: unknown) => {
      console.error('Chat server error', error);
    });

    socket.value.on('messageDeleted', ({ messageId }: { messageId: string }) => {
      messages.value = messages.value.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            deletedAt: new Date().toISOString(),
          };
        }
        return msg;
      });
    });

    socket.value.on('messageEdited', ({ messageId, newContent }: { messageId: string; newContent: string }) => {
      messages.value = messages.value.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            content: newContent,
            isEdited: true,
          };
        }
        return msg;
      });
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
    });
  }

  /**
   * Sends through the socket and waits for the server to store it, so a
   * message that never reached the server is reported instead of vanishing.
   */
  async function emitMessage(payload: { type: ChatMessage['type']; content: string; metadata?: any }) {
    if (!socket.value) initSocket();
    try {
      const saved: ChatMessage = await socket.value!
        .timeout(SEND_TIMEOUT_MS)
        .emitWithAck('sendMessage', { orderId, channel, ...payload });
      // The room broadcast normally delivers our own message too; add it
      // here in case this socket was between reconnects.
      if (saved?.id && !messages.value.some((m) => m.id === saved.id)) {
        messages.value.push(saved);
      }
      return true;
    } catch (error) {
      console.error('Failed to send message', error);
      showToast({ message: t('chat.sendFailed'), color: 'danger' });
      return false;
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim()) return false;
    return emitMessage({ type: 'TEXT', content: text });
  }

  function deleteMessage(messageId: string) {
    socket.value?.emit('deleteMessage', {
      orderId,
      channel,
      messageId,
    });
  }

  function editMessage(messageId: string, newContent: string) {
    socket.value?.emit('editMessage', {
      orderId,
      channel,
      messageId,
      newContent,
    });
  }

  async function sendMedia(file: File, type: 'IMAGE' | 'AUDIO', metadata?: any) {
    uploadingMediaType.value = type;
    // 1. Upload to REST endpoint first
    try {
      const response = await apiClient.chatControllerUploadFile({ file });
      const fileId = response.data;

      // 2. Send the fileId via WebSocket
      await emitMessage({ type, content: fileId, metadata });
    } catch (error) {
      console.error('Media upload failed', error);
      showToast({ message: t('chat.sendFailed'), color: 'danger' });
    } finally {
      uploadingMediaType.value = null;
    }
  }

  function disconnect() {
    socket.value?.disconnect();
    socket.value = null;
  }

  onUnmounted(disconnect);

  return {
    messages,
    isConnected,
    isLoading,
    uploadingMediaType,
    fetchHistory,
    initSocket,
    sendMessage,
    deleteMessage,
    editMessage,
    sendMedia,
    disconnect,
  };
}
