<template>
  <IonHeader>
    <IonToolbar>
      <div
        class="max-w-125 mx-auto flex rtl:flex-row-reverse justify-between items-center px-4 gap-2"
      >
        <IonImg
          src="/Tadil_logo.svg"
          alt="Tadil-تعديل"
          :style="{ width: '74px', height: '74px' }"
        />
        <span
          v-if="accountTypeKey"
          class="px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold whitespace-nowrap"
          data-testid="account-type-label"
        >
          {{ $t(accountTypeKey) }}
        </span>
        <IonButton fill="clear" router-link="/profile">
          <IonAvatar slot="icon-only" class="w-8 h-8">
            <IonImg alt="Avatar" src="/avatar.svg" />
          </IonAvatar>
        </IonButton>
      </div>
    </IonToolbar>
  </IonHeader>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
  IonHeader,
  IonImg,
  IonToolbar,
} from "@ionic/vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores";

const { userRole } = storeToRefs(useAuthStore());

const accountTypeKey = computed(() => {
  if (userRole.value === "tailor") return "common.accountType.tailor";
  if (userRole.value === "courier") return "common.accountType.courier";
  return null;
});
</script>
