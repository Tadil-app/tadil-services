import { ref, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/integration/api';

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

export function useChat(orderId: string, channel: 'TAILOR' | 'COURIER') {
  const authStore = useAuthStore();
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

    socket.value.on('connect', () => {
      console.log('Chat connected to socket', socket.value?.id);
      isConnected.value = true;
      socket.value?.emit('joinOrderChat', { orderId, channel });
    });

    socket.value.on('newMessage', (message: ChatMessage) => {
      console.log('New message received via socket:', message);
      messages.value.push(message);
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

  function sendMessage(text: string) {
    if (!socket.value || !text.trim()) return;

    socket.value.emit('sendMessage', {
      orderId,
      channel,
      type: 'TEXT',
      content: text,
    });
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
      socket.value?.emit('sendMessage', {
        orderId,
        channel,
        type,
        content: fileId,
        metadata,
      });
    } catch (error) {
      console.error('Media upload failed', error);
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
