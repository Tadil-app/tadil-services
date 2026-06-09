<template>
  <IonPage>
    <IonContent class="ion-padding">
      <div class="w-full h-full flex justify-center items-center">
        <IonCard color="light" class="ion-padding w-full">
          <div class="w-full">
            <img src="/logo.png" alt="Tadil-تعديل" class="h-60 w-60 mx-auto" />
          </div>

          <!-- Step 1: Phone Input -->
          <div v-if="loginStep === 'phone'" class="px-10 space-y-10">
            <div>
              <IonInput
                v-model="phoneNumber"
                :label="$t('login.form.phoneNumber.label')"
                label-placement="floating"
                type="tel"
                inputmode="tel"
                fill="solid"
                :placeholder="$t('login.form.phoneNumber.placeholder')"
                :minlength="10"
                :maxlength="10"
                :required="true"
                enterkeyhint="send"
                :error-text="phoneNumberErrorMessage"
              />
              <p v-if="phoneNumberErrorMessage" class="text-sm text-danger">
                {{ phoneNumberErrorMessage }}
              </p>
            </div>

            <IonButton
              expand="block"
              color="primary"
              type="submit"
              class="w-full"
              @click="onLogin"
              :disabled="isLoading"
            >
              <IonSpinner v-if="isLoading" name="crescent" />
              <span v-else>{{ $t("login.form.buttons.login") }}</span>
            </IonButton>
          </div>

          <!-- Step 2: Signup Form (Complete Profile) -->
          <div v-if="loginStep === 'signup'" class="px-10 space-y-5">
            <h2 class="text-center font-bold">{{ $t("login.form.signup.title") }}</h2>
            <IonInput
              v-model="firstName"
              :label="$t('login.form.signup.firstName.label')"
              label-placement="floating"
              fill="solid"
              :placeholder="$t('login.form.signup.firstName.placeholder')"
              required
            />
            <IonInput
              v-model="lastName"
              :label="$t('login.form.signup.lastName.label')"
              label-placement="floating"
              fill="solid"
              :placeholder="$t('login.form.signup.lastName.placeholder')"
              required
            />

            <div class="pt-5 space-y-3">
              <IonButton
                expand="block"
                color="primary"
                class="w-full"
                @click="onCompleteProfile"
                :disabled="isLoading"
              >
                <IonSpinner v-if="isLoading" name="crescent" />
                <span v-else>{{ $t("login.form.buttons.signup") }}</span>
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                class="w-full"
                @click="loginStep = 'phone'"
              >
                {{ $t("login.form.buttons.back") }}
              </IonButton>
            </div>
          </div>

          <!-- Status Displays -->
          <div v-if="loginStep === 'pending'" class="px-10 text-center space-y-5">
            <IonIcon :icon="timeOutline" class="text-6xl text-warning" />
            <p>{{ statusMessage || $t("login.form.status.pending") }}</p>
            <IonButton expand="block" fill="clear" @click="loginStep = 'phone'">
              {{ $t("login.form.buttons.back") }}
            </IonButton>
          </div>

          <div v-if="loginStep === 'rejected'" class="px-10 text-center space-y-5">
            <IonIcon :icon="closeCircleOutline" class="text-6xl text-danger" />
            <p>{{ statusMessage || $t("login.form.status.rejected") }}</p>
            <IonButton expand="block" fill="clear" @click="loginStep = 'phone'">
              {{ $t("login.form.buttons.back") }}
            </IonButton>
          </div>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores";
import {
  IonButton,
  IonCard,
  IonContent,
  IonInput,
  IonPage,
  IonSpinner,
  IonIcon,
  onIonViewWillEnter,
} from "@ionic/vue";
import { timeOutline, closeCircleOutline } from "ionicons/icons";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const loginStep = ref<"phone" | "signup" | "pending" | "rejected">("phone");
const isLoading = ref(false);
const statusMessage = ref("");

const phoneNumber = ref<string>("");
const phoneNumberErrorMessage = ref<string>("");

const firstName = ref("");
const lastName = ref("");

// Ionic keeps this page cached in the router outlet stack, so its local state
// survives a logout that navigates back here. Reset to the phone step on each
// entry, otherwise a user who just signed up would re-enter on the signup form.
onIonViewWillEnter(() => {
  loginStep.value = "phone";
  statusMessage.value = "";
  firstName.value = "";
  lastName.value = "";
  phoneNumberErrorMessage.value = "";
});

function validatePhoneNumber() {
  if (!phoneNumber.value) {
    phoneNumberErrorMessage.value = t("login.form.phoneNumber.undefinedErrorMessage");
    return false;
  }
  if (isNaN(Number(phoneNumber.value))) {
    phoneNumberErrorMessage.value = t("login.form.phoneNumber.numericErrorMessage");
    return false;
  }
  if (phoneNumber.value.length < 10) {
    phoneNumberErrorMessage.value = t("login.form.phoneNumber.lengthErrorMessage");
    return false;
  }

  phoneNumberErrorMessage.value = "";
  return true;
}

async function onLogin() {
  if (!validatePhoneNumber()) return;

  isLoading.value = true;
  try {
    const response = await authStore.login(phoneNumber.value);
    
    if (response.status === "authenticated") {
      handleNavigation(response.user?.role);
    } else if (response.status === "signup_required") {
      loginStep.value = "signup";
    } else if (response.status === "pending") {
      statusMessage.value = response.message || "";
      loginStep.value = "pending";
    } else if (response.status === "rejected") {
      statusMessage.value = response.message || "";
      loginStep.value = "rejected";
    }
  } catch (error) {
    console.error("Login error", error);
  } finally {
    isLoading.value = false;
  }
}

async function onCompleteProfile() {
  if (!firstName.value || !lastName.value) return;

  isLoading.value = true;
  try {
    const response = await authStore.completeProfile(
      phoneNumber.value,
      firstName.value,
      lastName.value
    );
    if (response.status === "authenticated") {
      handleNavigation(response.user?.role);
    }
  } catch (error) {
    console.error("Complete profile error", error);
  } finally {
    isLoading.value = false;
  }
}

function handleNavigation(role?: string) {
  if (role === "tailor") {
    router.push({ name: "tailor-dashboard" });
  } else if (role === "courier") {
    router.push({ name: "courier-dashboard" });
  } else {
    router.push({ name: "customer-dashboard" });
  }
}
</script>

<style scoped>
ion-content {
  --background: linear-gradient(to bottom right, #a8c5dd, #d4a5c7, #e87b56);
}
</style>
