<template>
  <div>
    <h1 class="text-2xl font-bold">{{ $t("nav.users") }}</h1>
    <div class="flex justify-between">
      <div class="flex gap-2 mt-4 ms-4">
        <button
          v-for="tab in userTypeTabsOptions"
          :key="tab.key"
          @click="handleTabChange(tab.key)"
          class="px-4 py-2 rounded-t-md"
          :class="{
            'bg-sidebar-accent text-sidebar-accent-foreground':
              selectedUserTypeTab !== tab.key,
            'bg-primary text-primary-foreground':
              selectedUserTypeTab === tab.key,
          }"
        >
          <p>{{ tab.label }}</p>
        </button>
      </div>
      <AddUserModal
        :selectedUserType="selectedUserTypeTab"
        :userRoleOptions="userTypeTabsOptions"
        @created:user="getUsers"
      />
    </div>
    <div class="border rounded-lg overflow-auto">
      <table class="relative w-full table-fixed">
        <thead class="border-b sticky top-0 z-10 bg-background h-12">
          <tr class="divide-x">
            <th class="ps-2 text-center">
              {{ $t("users.tableHeaders.phone") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("users.tableHeaders.firstName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("users.tableHeaders.lastName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("users.tableHeaders.email") }}
            </th>
            <th class="w-30">{{ $t("common.tableHeaders.actions") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="isLoading" v-for="index in 5" :key="index" class="divide-x">
            <td>
              <div class="ps-2 flex justify-center">
                <SkeletonItem variant="short-text" />
              </div>
            </td>
            <td>
              <div class="ps-2 flex justify-center">
                <SkeletonItem variant="short-text" />
              </div>
            </td>
            <td>
              <div class="ps-2 flex justify-center">
                <SkeletonItem variant="short-text" />
              </div>
            </td>
            <td>
              <div class="ps-2 flex justify-center">
                <SkeletonItem variant="short-text" />
              </div>
            </td>
            <td class="flex gap-2 justify-center">
              <SkeletonItem variant="action-button" />
              <SkeletonItem variant="action-button" />
            </td>
          </tr>
          <tr
            v-else
            v-for="user in displayedUsers"
            :key="user.id"
            class="h-12 divide-x"
          >
            <td class="ps-2 text-center truncate">
              {{ user.phone }}
            </td>
            <td class="ps-2 text-center truncate">
              {{ user.firstName }}
            </td>
            <td class="ps-2 text-center truncate">
              {{ user.lastName }}
            </td>
            <td class="ps-2 text-center truncate">
              {{ user.email ?? "--" }}
            </td>
            <td>
              <div class="flex gap-2 justify-center">
                <EditUserModal
                  :user="user"
                  :selectedUserType="selectedUserTypeTab"
                  :userRoleOptions="userTypeTabsOptions"
                  @updated:user="getUsers"
                />
                <DestructiveActionAlert
                  :title="$t(`users.deleteUser.confirmMessage`)"
                  :onConfirm="() => deleteUser(user.id)"
                >
                  <template #trigger="{ openAlert }">
                    <Button size="sm" variant="destructive" @click="openAlert">
                      <Trash2 />
                    </Button>
                  </template>
                </DestructiveActionAlert>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  apiClient,
  ROLE,
  type DisplayUserDTO,
  type RoleType,
} from "@/integration";
import AddUserModal from "./AddUserModal.vue";
import { computed, onBeforeMount, ref } from "vue";
import {
  Button,
  SkeletonItem,
  useToast,
  DestructiveActionAlert,
} from "@/components";
import { useI18n } from "vue-i18n";
import { Trash2 } from "lucide-vue-next";
import EditUserModal from "./EditUserModal.vue";

const { t } = useI18n();
const { openToast } = useToast();

const userTypeTabsOptions = computed(() => [
  {
    key: ROLE.TAILOR,
    label: t("users.roles.tailor"),
  },
  {
    key: ROLE.COURIER,
    label: t("users.roles.courier"),
  },
]);
const selectedUserTypeTab = ref<RoleType>(ROLE.TAILOR);

const handleTabChange = (tab: RoleType) => {
  selectedUserTypeTab.value = tab;
};

const isLoading = ref<boolean>(false);
const tailors = ref<DisplayUserDTO[]>([]);
const couriers = ref<DisplayUserDTO[]>([]);

async function getUsers() {
  const isLoading = ref<boolean>(true);
  await Promise.all([
    (tailors.value = (await apiClient.tailorsControllerGetTailors()).data),
    (couriers.value = (await apiClient.couriersControllerGetCouriers()).data),
  ]);
  isLoading.value = false;
}
const displayedUsers = computed(() => {
  switch (selectedUserTypeTab.value) {
    case ROLE.TAILOR:
      return tailors.value;
    case ROLE.COURIER:
      return couriers.value;
  }
});

async function deleteUser(id: string) {
  try {
    switch (selectedUserTypeTab.value) {
      case ROLE.TAILOR: {
        await apiClient.tailorsControllerDeleteTailor(id);
        break;
      }
      case ROLE.COURIER: {
        await apiClient.couriersControllerDeleteCourier(id);
        break;
      }
    }
    openToast(t(`users.deleteUser.success`));
    await getUsers();
  } catch (error: any) {
    openToast(
      t(`users.deleteUser.error`),
      error?.response?.data?.message || undefined,
      undefined,
      "destructive",
    );
  }
}

onBeforeMount(async () => {
  getUsers();
});
</script>
