<template>
  <div v-if="channels.length > 0" class="px-4 pb-10">
    <h3 class="text-lg font-bold mb-3 px-2 text-main">{{ $t("chat.title") }}</h3>

    <IonSegment
      v-if="channels.length > 1"
      :value="activeChannel"
      class="mb-4 bg-item rounded-2xl p-1 border border-main/5"
      @ion-change="selected = $event.detail.value as ChatChannel"
    >
      <IonSegmentButton
        v-for="option in channels"
        :key="option.channel"
        :value="option.channel"
        class="rounded-xl"
      >
        <IonLabel>{{ option.label }}</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    <div class="h-125 border border-main/5 rounded-3xl overflow-hidden shadow-sm bg-item">
      <Chat :key="orderId + activeChannel" :order-id="orderId" :channel="activeChannel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/vue";
import { ChatChannel } from "@/composables";
import Chat from "./Chat.vue";

/** The order chats this user can open, with the tab label for each. */
const props = defineProps<{
  orderId: string;
  channels: { channel: ChatChannel; label: string }[];
}>();

const selected = ref<ChatChannel | null>(null);

// Stay on the chosen chat while it is available, else show the first one.
const activeChannel = computed<ChatChannel>(() => {
  const available = props.channels.map((c) => c.channel);
  return selected.value && available.includes(selected.value) ? selected.value : available[0];
});
</script>
