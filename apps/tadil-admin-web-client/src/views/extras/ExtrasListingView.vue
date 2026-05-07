<template>
  <div>
    <h1 class="text-2xl font-bold">{{ $t("nav.extras") }}</h1>
    <div class="flex justify-end">
      <AddExtraModal @created:extra="getExtras" />
    </div>
    <div class="mt-4 border rounded-lg overflow-auto">
      <table class="relative w-full table-fixed">
        <thead class="border-b sticky top-0 z-10 bg-background h-12">
          <tr class="divide-x">
            <th class="ps-2 text-center">
              {{ $t("common.tableHeaders.englishName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("common.tableHeaders.arabicName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("common.tableHeaders.hindiName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("common.tableHeaders.urduName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("common.tableHeaders.bengaliName") }}
            </th>
            <th class="ps-2 text-center">
              {{ $t("common.tableHeaders.price") }}
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
            v-for="extra in extras"
            :key="extra.id"
            class="h-12 divide-x"
          >
            <td class="ps-2 text-center max-w-40 truncate">
              {{ extra.englishName }}
            </td>
            <td class="ps-2 text-center max-w-40 truncate">
              {{ extra.arabicName }}
            </td>
            <td class="ps-2 text-center max-w-40 truncate">
              {{ extra.hindiName }}
            </td>
            <td class="ps-2 text-center max-w-40 truncate">
              {{ extra.urduName }}
            </td>
            <td class="ps-2 text-center max-w-40 truncate">
              {{ extra.bengaliName }}
            </td>
            <td class="ps-2 text-center max-w-40 truncate">
              {{ extra.price }}{{ $t("common.currencies.ras") }}
            </td>
            <td class="">
              <div class="flex gap-2 justify-center">
                <EditExtraModal
                  :key="extra.id"
                  :extra="extra"
                  @updated:extra="getExtras"
                />
                <DestructiveActionAlert
                  :title="$t('extras.deleteExtra.confirmMessage')"
                  :onConfirm="() => deleteExtra(extra.id)"
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
import { onBeforeMount, ref } from "vue";
import {
  Button,
  DestructiveActionAlert,
  SkeletonItem,
  useToast,
} from "@/components";
import { Trash2 } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import AddExtraModal from "./AddExtraModal.vue";
import EditExtraModal from "./EditExtraModal.vue";
import { apiClient, type DisplayExtraDTO } from "@/integration";

const { t } = useI18n();
const { openToast } = useToast();

const extras = ref<DisplayExtraDTO[]>([]);
const isLoading = ref<boolean>(false);

async function getExtras() {
  isLoading.value = true;
  extras.value = (await apiClient.extrasControllerGetExtras()).data;
  isLoading.value = false;
}

async function deleteExtra(extraId: string) {
  try {
    await apiClient.extrasControllerDeleteExtra(extraId);
    openToast(t("extras.deleteExtra.success"));
    getExtras();
  } catch (error: any) {
    openToast(
      t("extras.deleteExtra.error"),
      error?.response?.data?.message || undefined,
      undefined,
      "destructive"
    );
  }
}
onBeforeMount(async () => {
  await getExtras();
});
</script>
