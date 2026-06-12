import { apiClient, apiInstance } from "@/integration/api";
import { AuthResponseDto, User, UpdateProfileDto, DisplayAddressDto, CreateAddressDto, UpdateAddressDto } from "@/integration/dtos";
import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const userId = ref("");
  const userRole = ref("");
  const token = ref("");
  const userInfo = ref<User | null>(null);
  const userAddresses = ref<DisplayAddressDto[]>([]);
  const walletDetails = ref<any>(null);
  const router = useRouter();

  async function initAuth() {
    const { value: storedToken } = await Preferences.get({ key: "token" });
    const { value: storedUserId } = await Preferences.get({ key: "userId" });
    const { value: storedUserRole } = await Preferences.get({ key: "userRole" });
    token.value = storedToken || "";
    userId.value = storedUserId || "";
    userRole.value = storedUserRole || "";

    if (token.value) {
      apiInstance.setSecurityData(token.value);
      await fetchProfile();
      await fetchAddresses();
      if (userRole.value === 'tailor' || userRole.value === 'courier') {
        await fetchWallet();
      }
    }
  }

  async function login(phone: string): Promise<AuthResponseDto> {
    const { data } = await apiClient.authControllerLogin({
      phone,
    });

    if (data.status === "authenticated" && data.token && data.user) {
      await setSession(data.token, data.user);
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
      await setSession(data.token, data.user);
    }

    return data;
  }

  async function fetchProfile() {
    try {
      const { data } = await apiClient.authControllerGetProfile();
      userInfo.value = data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      if ((error as any).response?.status === 401) {
        await logout();
      }
    }
  }

  async function updateProfile(dto: UpdateProfileDto) {
    const { data } = await apiClient.authControllerUpdateProfile(dto);
    userInfo.value = data;
  }

  async function fetchAddresses() {
    try {
      const { data } = await apiClient.authControllerGetAddresses();
      userAddresses.value = data;
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  }

  async function addAddress(dto: CreateAddressDto) {
    await apiClient.authControllerAddAddress(dto);
    await fetchAddresses();
  }

  async function updateAddress(id: string, dto: UpdateAddressDto) {
    await apiClient.authControllerUpdateAddress(id, dto);
    await fetchAddresses();
  }

  async function fetchWallet() {
    if (!userId.value) return;
    try {
      const { data } = await apiClient.walletControllerGetDetails(userId.value);
      walletDetails.value = data;
    } catch (error) {
      console.error("Failed to fetch wallet", error);
    }
  }

  async function requestPayout(amount: number) {
    if (!userId.value) return;
    await apiClient.walletControllerRequestPayout(userId.value, { amount });
    await fetchWallet();
  }

  async function setSession(newToken: string, user: User) {
    token.value = newToken;
    userId.value = user.id;
    userRole.value = user.role;
    userInfo.value = user;
    
    apiInstance.setSecurityData(newToken);

    await Preferences.set({ key: "token", value: newToken });
    await Preferences.set({ key: "userId", value: user.id });
    await Preferences.set({ key: "userRole", value: user.role });

    await fetchAddresses();
    if (user.role === 'tailor' || user.role === 'courier') {
      await fetchWallet();
    }
  }

  async function logout() {
    const role = userRole.value;
    token.value = "";
    userId.value = "";
    userRole.value = "";
    userInfo.value = null;
    userAddresses.value = [];
    walletDetails.value = null;
    apiInstance.setSecurityData(null);
    await Preferences.remove({ key: "token" });
    await Preferences.remove({ key: "userId" });
    await Preferences.remove({ key: "userRole" });

    if (role === "tailor" || role === "courier") {
      router.push({ name: "login" });
    } else {
      router.push({ name: "customer-new-order-category-selection" });
    }
  }

  return { 
    userId, 
    userRole, 
    token, 
    userInfo, 
    userAddresses, 
    walletDetails,
    initAuth, 
    login, 
    completeProfile, 
    fetchProfile, 
    updateProfile, 
    fetchAddresses, 
    addAddress, 
    updateAddress, 
    fetchWallet,
    requestPayout,
    logout 
  };
});
