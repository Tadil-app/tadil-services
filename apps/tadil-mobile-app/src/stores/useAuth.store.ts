import { apiClient } from "@/integration/api";
import { AuthResponseDto } from "@/integration/dtos";
import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const userId = ref("");
  const userRole = ref("");
  const token = ref("");
  const router = useRouter();

  async function initAuth() {
    const { value: storedToken } = await Preferences.get({ key: "token" });
    const { value: storedUserId } = await Preferences.get({ key: "userId" });
    const { value: storedUserRole } = await Preferences.get({ key: "userRole" });
    token.value = storedToken || "";
    userId.value = storedUserId || "";
    userRole.value = storedUserRole || "";
  }

  async function login(phone: string): Promise<AuthResponseDto> {
    const { data } = await apiClient.authControllerLogin({
      phone,
    });

    if (data.status === "authenticated" && data.token && data.user) {
      await setSession(data.token, data.user.id, data.user.role);
    }

    return data;
  }

  async function completeProfile(phone: string, firstName: string, lastName: string): Promise<AuthResponseDto> {
    const { data } = await apiClient.authControllerCompleteProfile({
      phone,
      firstName,
      lastName,
    });

    if (data.status === "authenticated" && data.token && data.user) {
      await setSession(data.token, data.user.id, data.user.role);
    }

    return data;
  }

  async function setSession(newToken: string, newUserId: string, newRole: string) {
    token.value = newToken;
    userId.value = newUserId;
    userRole.value = newRole;
    await Preferences.set({ key: "token", value: newToken });
    await Preferences.set({ key: "userId", value: newUserId });
    await Preferences.set({ key: "userRole", value: newRole });
  }

  async function logout() {
    token.value = "";
    userId.value = "";
    userRole.value = "";
    await Preferences.remove({ key: "token" });
    await Preferences.remove({ key: "userId" });
    await Preferences.remove({ key: "userRole" });
    router.push({ name: "login" });
  }

  return { userId, userRole, token, initAuth, login, completeProfile, logout };
});
