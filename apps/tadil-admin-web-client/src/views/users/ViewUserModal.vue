<template>
  <Button size="sm" variant="outline" @click="isOpen = true">
    <Eye class="h-4 w-4 me-1" />
    {{ $t("users.buttons.view") }}
  </Button>
  <Modal
    v-model="isOpen"
    @close-modal="isOpen = false"
    class="w-[520px] max-w-[95vw]"
  >
    <div class="space-y-5">
      <div class="flex items-center gap-3 border-b border-border pb-4 pe-8">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <component :is="headerIcon" class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <h1 class="text-lg font-bold leading-tight">
            {{ $t(`users.viewModal.title.${role}`) }}
          </h1>
          <p class="truncate text-sm text-muted-foreground">
            {{ user.firstName }} {{ user.lastName }}
          </p>
        </div>
      </div>

      <section class="space-y-3">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ $t("users.viewModal.personalInfo") }}
        </h2>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.firstName") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(user.firstName) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.lastName") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(user.lastName) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.phone") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium" dir="ltr">
              {{ display(user.phone) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.email") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(user.email) }}
            </dd>
          </div>
          <div
            v-if="showCommission"
            class="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2"
          >
            <dt class="text-xs text-muted-foreground">
              {{ $t("common.inputs.commissionRate.label") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(user.commissionRate) }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="space-y-3">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ $t("users.viewModal.address") }}
        </h2>
        <p
          v-if="!hasAddress"
          class="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground"
        >
          {{ $t("users.viewModal.noAddress") }}
        </p>
        <dl v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.address.city") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(cityLabel(user)) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.address.district") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(districtLabel(user)) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.viewModal.street") }}
            </dt>
            <dd class="mt-0.5 font-medium">
              {{ display(streetLabel(user)) }}
            </dd>
          </div>
          <div
            v-if="hasCoordinates"
            class="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2"
          >
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.viewModal.coordinates") }}
            </dt>
            <dd class="mt-0.5 font-medium" dir="ltr">
              <a
                :href="mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                {{ user.latitude }}, {{ user.longitude }}
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Button, Modal } from "@/components";
import { Eye, Scissors, Truck, User } from "lucide-vue-next";
import { ROLE, type DisplayUserDTO, type RoleType } from "@/integration";
import { useLocalizedCityComposable } from "@/composables";

const props = defineProps<{
  user: DisplayUserDTO;
  userType?: RoleType;
}>();

const isOpen = ref(false);
const { cityLabel, districtLabel, streetLabel } = useLocalizedCityComposable();

const role = computed(
  () => props.userType ?? props.user.role ?? ROLE.CUSTOMER,
);

const headerIcon = computed(() => {
  switch (role.value) {
    case ROLE.TAILOR:
      return Scissors;
    case ROLE.COURIER:
      return Truck;
    default:
      return User;
  }
});

const showCommission = computed(
  () => role.value === ROLE.TAILOR || role.value === ROLE.COURIER,
);

const display = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return "--";
  return String(value);
};

const hasCoordinates = computed(
  () => props.user.latitude != null && props.user.longitude != null,
);

const hasAddress = computed(
  () =>
    Boolean(
      cityLabel(props.user) ||
        districtLabel(props.user) ||
        streetLabel(props.user) ||
        hasCoordinates.value,
    ),
);

const mapUrl = computed(() => {
  if (!hasCoordinates.value) return undefined;
  return `https://www.openstreetmap.org/?mlat=${props.user.latitude}&mlon=${props.user.longitude}#map=16/${props.user.latitude}/${props.user.longitude}`;
});
</script>
