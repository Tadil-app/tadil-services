<template>
  <div class="border rounded-lg overflow-auto">
    <table class="relative w-full table-fixed">
      <thead class="border-b sticky top-0 z-10 bg-background h-12">
        <tr class="divide-x">
          <th class="w-24 text-center">
            {{ $t("common.tableHeaders.sorting") }}
          </th>
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
          <th class="ps-2 text-center">
            {{ $t("customers.tableHeaders.city") }}
          </th>
          <th class="w-40">{{ $t("common.tableHeaders.actions") }}</th>
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
          v-for="user in users"
          :key="user.id"
          class="h-12 divide-x"
        >
          <td class="ps-2 text-center">{{ user.sorting }}</td>
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
          <td class="ps-2 text-center truncate">
            {{ cityLabel(user) || "--" }}
          </td>
          <td>
            <div class="flex gap-2 justify-center">
              <SortingButton
                :sorting="user.sorting"
                :max="maxSorting"
                :save="(sorting) => updateSorting(user.id, sorting)"
              />
              <EditUserModal
                :user="user"
                :selectedUserType="userType"
                @updated:user="handleRefresh"
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
</template>

<script setup lang="ts">
import {
  Button,
  SkeletonItem,
  SortingButton,
  useToast,
  DestructiveActionAlert,
} from "@/components";
import { Trash2 } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import EditUserModal from "../EditUserModal.vue";
import { apiClient, ROLE, type DisplayUserDTO, type RoleType } from "@/integration";
import { useLocalizedCityComposable } from "@/composables";

const { t } = useI18n();
const { openToast } = useToast();
const { cityLabel } = useLocalizedCityComposable();

const props = defineProps<{
  users: DisplayUserDTO[];
  isLoading: boolean;
  userType: RoleType;
  maxSorting: number;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const handleRefresh = () => {
  emit("refresh");
};

async function updateSorting(id: string, sorting: number) {
  await apiClient.usersSortingControllerUpdateSorting(id, { sorting });
  handleRefresh();
}

async function deleteUser(id: string) {
  try {
    switch (props.userType) {
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
    handleRefresh();
  } catch (error: any) {
    openToast(
      t(`users.deleteUser.error`),
      error?.response?.data?.message || undefined,
      undefined,
      "destructive",
    );
  }
}
</script>
