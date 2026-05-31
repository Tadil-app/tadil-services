<template>
  <Modal v-model="isOpen" @close-modal="closeModal" class="max-w-4xl max-h-[90vh] overflow-y-auto">
    <div v-if="isLoadingDetails" class="py-20 text-center text-muted-foreground">
      <Loader2 class="h-8 w-8 animate-spin mx-auto mb-4" />
      {{ $t("orders.details.loading") }}
    </div>
    <div v-else-if="selectedOrderDetails" class="space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-start border-b pb-4">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-2">
            {{ $t("orders.details.title", { ref: selectedOrderDetails.reference }) }}
            <span 
              class="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border"
              :class="statusClasses(selectedOrderDetails.status)"
            >
              {{ $t('orderStatus.' + selectedOrderDetails.status) }}
            </span>
          </h1>
          <p class="text-sm text-muted-foreground mt-1">{{ $t("orders.details.placedOn") }} {{ formatDate(selectedOrderDetails.date) }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-muted-foreground">{{ $t("orders.details.totalPrice") }}</p>
          <p class="text-2xl font-bold text-primary">{{ selectedOrderDetails.totalPrice }} {{ $t("common.currencies.ras") }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left Column: Info & History -->
        <div class="md:col-span-1 space-y-8">
          <!-- Participants -->
          <div class="bg-muted/30 p-4 rounded-xl border space-y-4">
            <h3 class="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{{ $t("orders.details.participants") }}</h3>
            <div class="space-y-3">
              <div>
                <p class="text-xs text-muted-foreground">{{ $t("orders.details.customer") }}</p>
                <p class="font-medium">{{ selectedOrderDetails.customerName }}</p>
                <p class="text-sm text-muted-foreground">{{ selectedOrderDetails.city || $t("orders.details.noCity") }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">{{ $t("orders.details.assignedTailor") }}</p>
                <p class="font-medium">{{ selectedOrderDetails.tailorName || $t("orders.details.pending") }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">{{ $t("orders.details.assignedCourier") }}</p>
                <p class="font-medium">{{ selectedOrderDetails.courierName || $t("orders.details.pending") }}</p>
              </div>
            </div>
          </div>

          <!-- History Timeline -->
          <div>
            <h3 class="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">{{ $t("orders.details.statusHistory") }}</h3>
            <div class="space-y-4 border-l-2 border-primary/20 ml-2 pl-4">
              <div v-for="(hist, idx) in selectedOrderDetails.history" :key="idx" class="relative">
                <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                <p class="font-medium text-sm">{{ $t('orderStatus.' + hist.status) }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDate(hist.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Items & Chat -->
        <div class="md:col-span-2 space-y-8">
          <!-- Items -->
          <div>
            <h3 class="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">{{ $t("orders.details.orderItems") }}</h3>
            <div class="space-y-3">
              <!-- Predefined Items -->
              <div v-for="item in selectedOrderDetails.items" :key="item.id" class="flex gap-4 p-3 border rounded-xl bg-card">
                <img :src="item.imageFileUrl" class="w-20 h-20 object-cover rounded-lg bg-muted/50" />
                <div class="flex-grow">
                  <div class="flex justify-between">
                    <p class="font-bold">{{ item.englishName }}</p>
                    <p class="font-semibold text-primary">{{ item.price }} {{ $t("common.currencies.ras") }}</p>
                  </div>
                  <div class="mt-2 space-y-1">
                    <div v-for="section in item.sections" :key="section.id">
                      <span class="text-xs font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-md">{{ section.englishName }}</span>
                      <div class="text-xs text-muted-foreground mt-1 pl-2 border-l border-medium/20">
                        <p v-for="alt in section.alterations" :key="alt.id">
                          • {{ alt.englishName }} (+{{ alt.price }} {{ $t("common.currencies.ras") }})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Items -->
              <div v-for="item in selectedOrderDetails.customItems" :key="item.id" class="flex gap-4 p-3 border rounded-xl bg-card">
                <img :src="item.imageFileUrl" class="w-20 h-20 object-cover rounded-lg bg-muted/50" />
                <div class="flex-grow">
                  <div class="flex justify-between">
                    <p class="font-bold">{{ $t("orders.details.customRequest") }}</p>
                    <p class="font-semibold text-primary">{{ item.price }} {{ $t("common.currencies.ras") }}</p>
                  </div>
                  <div class="mt-2 space-y-1">
                    <div class="text-xs text-muted-foreground pl-2 border-l border-medium/20">
                      <p v-for="alt in item.alterations" :key="alt.id">
                        • {{ alt.englishName }} (+{{ alt.price }} {{ $t("common.currencies.ras") }})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Logs -->
          <div v-if="selectedOrderDetails.chats?.length">
            <h3 class="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">{{ $t("orders.details.chatLogs") }}</h3>
            <div class="space-y-6">
              <div v-for="chat in selectedOrderDetails.chats" :key="chat.id" class="border rounded-xl bg-card overflow-hidden">
                <div class="bg-muted/50 px-4 py-2 border-b">
                  <p class="font-semibold text-sm">{{ chat.channel }} {{ $t("orders.details.channel") }}</p>
                </div>
                <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
                  <div v-if="!chat.messages.length" class="text-xs text-muted-foreground text-center">{{ $t("orders.details.noMessages") }}</div>
                  <div 
                    v-for="msg in chat.messages" 
                    :key="msg.id"
                    class="flex flex-col max-w-[85%]"
                    :class="msg.senderId === selectedOrderDetails.customerId ? 'ml-auto items-end' : 'mr-auto items-start'"
                  >
                    <div v-if="msg.deletedAt" class="text-xs italic text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border">
                      {{ $t("orders.details.messageDeleted") }}
                    </div>
                    <template v-else>
                      <div v-if="msg.type === 'TEXT'" class="px-3 py-2 rounded-2xl text-sm" :class="msg.senderId === selectedOrderDetails.customerId ? 'bg-primary text-primary-contrast rounded-tr-none' : 'bg-muted rounded-tl-none'">
                        {{ msg.content }}
                      </div>
                      <div v-else-if="msg.type === 'IMAGE'" class="rounded-xl overflow-hidden border max-w-xs">
                        <img :src="msg.content" class="w-full h-auto" />
                      </div>
                      <div v-else-if="msg.type === 'AUDIO'" class="px-3 py-2 rounded-2xl bg-muted text-sm flex items-center gap-2">
                        🎤 Voice Message <span class="text-xs text-muted-foreground" v-if="msg.metadata?.duration">({{ Math.round(msg.metadata.duration) }}s)</span>
                        <audio :src="msg.content" controls class="h-8 w-40 ml-2"></audio>
                      </div>
                    </template>
                    <span class="text-[10px] text-muted-foreground mt-0.5 px-1">
                      {{ formatDate(msg.timestamp) }}<span v-if="msg.isEdited"> - ({{ $t("orders.details.edited") }})</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Modal } from "@/components";
import { Loader2 } from "lucide-vue-next";
import { apiClient, type DisplayOrderDetailsDto } from "@/integration";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  orderId: string | null;
}>();

const isLoadingDetails = ref(false);
const selectedOrderDetails = ref<DisplayOrderDetailsDto | null>(null);

const fetchOrderDetails = async () => {
  if (!props.orderId) return;
  isLoadingDetails.value = true;
  selectedOrderDetails.value = null;
  try {
    const response = await apiClient.ordersControllerGetOrderById(props.orderId);
    selectedOrderDetails.value = response.data;
  } catch (error) {
    console.error("Failed to fetch order details", error);
  } finally {
    isLoadingDetails.value = false;
  }
};

watch(() => props.orderId, (newId) => {
  if (isOpen.value && newId) {
    fetchOrderDetails();
  }
});

watch(isOpen, (newVal) => {
  if (newVal && props.orderId) {
    fetchOrderDetails();
  }
});

const closeModal = () => {
  isOpen.value = false;
};

const statusClasses = (status: string) => {
  switch (status) {
    case "done": return "text-green-700 bg-green-500/20 border-green-500/30";
    case "pending": return "text-amber-700 bg-amber-500/20 border-amber-500/30";
    case "inProgress": return "text-blue-700 bg-blue-500/20 border-blue-500/30";
    case "canceled": return "text-red-700 bg-red-500/20 border-red-500/30";
    default: return "text-purple-700 bg-purple-500/20 border-purple-500/30";
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};
</script>
