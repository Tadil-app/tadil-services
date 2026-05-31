<template>
  <div>
    <h1 class="text-2xl font-bold">{{ $t("nav.tailors") }}</h1>
    <div class="flex justify-end mb-4 mt-4">
      <AddUserModal
        :selectedUserType="ROLE.TAILOR"
        @created:user="fetchTailors"
      />
    </div>
    
    <UsersTable 
      :users="tailors" 
      :is-loading="isLoading" 
      :user-type="ROLE.TAILOR" 
      @refresh="fetchTailors" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient, ROLE, type DisplayUserDTO } from "@/integration";
import AddUserModal from "./AddUserModal.vue";
import UsersTable from "./components/UsersTable.vue";

const tailors = ref<DisplayUserDTO[]>([]);
const isLoading = ref<boolean>(false);

const fetchTailors = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.tailorsControllerGetTailors();
    tailors.value = response.data;
  } catch (error) {
    console.error("Failed to fetch tailors", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTailors);
</script>
