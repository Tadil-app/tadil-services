<template>
  <IonPage>
    <IonContent class="ion-padding">
      <div class="w-full h-full flex justify-center items-center">
        <IonCard color="light" class="ion-padding w-full">
          <div class="w-full">
            <img src="/logo.png" alt="Tadil-تعديل" class="h-60 w-60 mx-auto" />
          </div>
          <div v-if="loginStep === 1" class="px-10 space-y-10">
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
              @click="getOtpCode"
            >
              {{ $t("login.form.buttons.sendCode") }}
            </IonButton>
          </div>
          <div v-if="loginStep === 2" class="px-10 space-y-10">
            <div>
              <IonInputOtp
                v-model="otpCode"
                type="number"
                :length="6"
                :label="$t('login.form.otpCode.label')"
                label-placement="floating"
                shape="round"
                class="ion-touched has-focus"
                :class="[
                  {
                    'ion-invalid':
                      isOtpCodeValid !== undefined && !isOtpCodeValid,
                  },
                ]"
              >
                {{ $t("login.form.otpCode.notRecieved") }} !
                <span class="text-primary" @click="getOtpCode">{{
                  $t("login.form.otpCode.resendCode")
                }}</span>
              </IonInputOtp>
            </div>

            <IonButton
              expand="block"
              color="primary"
              type="submit"
              class="w-full"
              @click="onVerifyCode"
            >
              {{ $t("login.form.buttons.verifyCode") }}
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
  IonInputOtp,
  IonPage,
} from "@ionic/vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const authStore = useAuthStore();

const loginStep = ref(1);

const phoneNumber = ref<string>("");
const phoneNumberErrorMessage = ref<string>("");
function validatePhoneNumber() {
  if (!phoneNumber.value) {
    phoneNumberErrorMessage.value = t(
      "login.form.phoneNumber.undefinedErrorMessage",
    );
    return false;
  }
  if (isNaN(Number(phoneNumber.value))) {
    phoneNumberErrorMessage.value = t(
      "login.form.phoneNumber.numericErrorMessage",
    );
    return false;
  }
  if (phoneNumber.value.length < 10) {
    phoneNumberErrorMessage.value = t(
      "login.form.phoneNumber.lengthErrorMessage",
    );
    return false;
  }

  phoneNumberErrorMessage.value = "";
  return true;
}

async function getOtpCode() {
  if (validatePhoneNumber()) {
    await authStore.GetOtpCode(phoneNumber.value);
    loginStep.value = 2;
  }
}

const otpCode = ref<string>("");
const isOtpCodeValid = ref<boolean>();

const router = useRouter();
async function onVerifyCode() {
  if (otpCode.value.length !== 6 || isNaN(Number(otpCode.value))) {
    isOtpCodeValid.value = false;
    return;
  }

  isOtpCodeValid.value = await authStore.VerifyOtpCode(otpCode.value);
  if (isOtpCodeValid.value) {
    router.push({ name: "tailor-dashboard" });
    return;
  }
}
</script>

<style scoped>
ion-content {
  --background: linear-gradient(to bottom right, #a8c5dd, #d4a5c7, #e87b56);
}
</style>
