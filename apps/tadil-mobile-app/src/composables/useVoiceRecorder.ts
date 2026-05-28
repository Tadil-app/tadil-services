import { ref } from "vue";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { useToast } from "./useToast.composable";
import { useI18n } from "vue-i18n";

export function useVoiceRecorder() {
  const isRecording = ref(false);
  const voiceMessage = ref<string>();
  const recordingStartTime = ref<number>(0);
  const recordingDuration = ref<number>(0);
  const { showToast } = useToast();
  const { t } = useI18n();

  async function startRecording() {
    try {
      const permission = await VoiceRecorder.requestAudioRecordingPermission();
      if (permission.value) {
        await VoiceRecorder.startRecording();
        recordingStartTime.value = Date.now();
        isRecording.value = true;
      } else {
        showToast({
          message: t("common.errors.voiceRecorder.permissionDenied"),
          color: "warning",
        });
      }
    } catch (error) {
      showToast({
        message: t("common.errors.voiceRecorder.startFailed"),
        color: "danger",
      });
    }
  }

  async function cancelRecording() {
    try {
      await VoiceRecorder.stopRecording();
      isRecording.value = false;
      voiceMessage.value = undefined;
      recordingStartTime.value = 0;
    } catch (error) {
      showToast({
        message: t("common.errors.voiceRecorder.saveFailed"),
        color: "danger",
      });
    }
  }

  async function stopAndGetBlob() {
    try {
      const result = await VoiceRecorder.stopRecording();
      isRecording.value = false;
      recordingDuration.value = (Date.now() - recordingStartTime.value) / 1000;

      if (!result.value.recordDataBase64) return null;

      const base64Data = `data:${result.value.mimeType};base64,${result.value.recordDataBase64}`;
      voiceMessage.value = base64Data;

      const response = await fetch(base64Data);
      return await response.blob();
    } catch (error) {
      showToast({
        message: t("common.errors.voiceRecorder.saveFailed"),
        color: "danger",
      });
      return null;
    }
  }

  return {
    isRecording,
    voiceMessage,
    recordingDuration,
    startRecording,
    cancelRecording,
    stopAndGetBlob,
  };
}
