<template>
  <div class="h-screen w-screen grid grid-rows-[auto_1fr] bg-background">
    <AppHeader />
    <div class="h-full w-full grid grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar />
      <main class="p-6 bg-muted/10 h-full overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
import Sidebar from "./Sidebar.vue";
</script>
