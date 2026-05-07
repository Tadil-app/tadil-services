import { apiClient } from "@/integration/api";
import { VerifyOtpDto } from "@/integration/dtos";
import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const userId = "1abe4126-67a0-e1c0-810b-3de72f094f7d";
  const token = ref("");
  const router = useRouter();

  async function initAuth() {
    const { value } = await Preferences.get({ key: "token" });
    token.value = value || "";
  }

  async function GetOtpCode(phone: string): Promise<VerifyOtpDto> {
    const { data: otpCode } = await apiClient.authControllerGetOtpCode({
      phone,
    });
    return otpCode;
  }

  async function VerifyOtpCode(code: string): Promise<boolean> {
    const { data: isOtpValid } = await apiClient.authControllerVerifyOtp({
      code,
    });
    return isOtpValid;
  }

  async function logout() {
    token.value = "";
    await Preferences.remove({ key: "token" });
    router.push({ name: "customer-dashboard" });
  }

  return { userId, token, initAuth, GetOtpCode, VerifyOtpCode, logout };
});
