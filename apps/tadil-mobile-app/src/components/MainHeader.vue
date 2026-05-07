<template>
  <IonHeader>
    <IonToolbar>
      <div
        class="max-w-125 mx-auto flex rtl:flex-row-reverse justify-between items-center px-4"
      >
        <IonImg
          src="/logo.png"
          alt="Tadil-تعديل"
          :style="{ width: '74px', height: '74px' }"
        />
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
</script>
