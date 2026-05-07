<template>
  <div v-if="isRecording" class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      <span class="text-sm font-medium text-main">{{ $t("chat.recording") }}</span>
    </div>

    <div class="flex items-center gap-4">
      <Trash2
        class="text-red-500 h-6 w-6 active:scale-90 transition-transform cursor-pointer"
        @click="cancelRecording"
      />
      <div class="rounded-xl bg-primary p-1.5 cursor-pointer" @click="handleSendVoice">
        <SendHorizonal class="text-primary-contrast h-6 w-6" />
      </div>
    </div>
  </div>
  
  <div v-if="!isRecording" class="grid grid-cols-[auto_1fr_auto] gap-2">
    <div
      class="rounded-xl border border-primary p-1.5 transition-colors cursor-pointer"
      @click="startRecording"
    >
      <Mic class="text-primary h-6 w-6" />
    </div>
    <input
      type="text"
      :placeholder="$t('chat.placeholder')"
      class="p-2 border border-primary rounded-xl outline-none bg-item text-main placeholder:text-placeholder"
      enterkeyhint="send"
    />
    <div class="rounded-xl bg-primary p-1.5 cursor-pointer">
      <SendHorizonal class="text-primary-contrast h-6 w-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mic, SendHorizonal, Trash2 } from "lucide-vue-next";
import { useVoiceRecorder } from "@/composables";

const {
  isRecording,
  startRecording,
  cancelRecording,
  stopAndGetBlob,
} = useVoiceRecorder();

async function handleSendVoice() {
  const audioBlob = await stopAndGetBlob();
  if (audioBlob) {
    console.log("Audio blob ready for upload:", audioBlob);
  }
}
</script>
