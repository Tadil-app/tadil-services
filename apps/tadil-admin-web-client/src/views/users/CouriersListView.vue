<template>
  <div>
    <h1 class="text-2xl font-bold">{{ $t("nav.couriers") }}</h1>
    <div class="flex justify-end mb-4 mt-4">
      <AddUserModal
        :selectedUserType="ROLE.COURIER"
        @created:user="fetchCouriers"
      />
    </div>
    
    <UsersTable 
      :users="couriers" 
      :is-loading="isLoading" 
      :user-type="ROLE.COURIER" 
      @refresh="fetchCouriers" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient, ROLE, type DisplayUserDTO } from "@/integration";
import AddUserModal from "./AddUserModal.vue";
import UsersTable from "./components/UsersTable.vue";

const couriers = ref<DisplayUserDTO[]>([]);
const isLoading = ref<boolean>(false);

const fetchCouriers = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.couriersControllerGetCouriers();
    couriers.value = response.data;
  } catch (error) {
    console.error("Failed to fetch couriers", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCouriers);
</script>
