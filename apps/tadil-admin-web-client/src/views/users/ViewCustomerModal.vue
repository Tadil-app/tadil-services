<template>
  <Button size="sm" variant="outline" @click="isOpen = true">
    <Eye class="h-4 w-4 me-1" />
    {{ $t("customers.buttons.view") }}
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
          <User class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <h1 class="text-lg font-bold leading-tight">
            {{ $t("customers.viewModal.title") }}
          </h1>
          <p class="truncate text-sm text-muted-foreground">
            {{ customer.firstName }} {{ customer.lastName }}
          </p>
        </div>
      </div>

      <section class="space-y-3">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ $t("customers.viewModal.personalInfo") }}
        </h2>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.firstName") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(customer.firstName) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.lastName") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(customer.lastName) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.phone") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium" dir="ltr">
              {{ display(customer.phone) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.tableHeaders.email") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(customer.email) }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="space-y-3">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ $t("customers.viewModal.address") }}
        </h2>
        <p
          v-if="!hasAddress"
          class="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground"
        >
          {{ $t("customers.viewModal.noAddress") }}
        </p>
        <dl v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.address.city") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(cityLabel(customer)) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3">
            <dt class="text-xs text-muted-foreground">
              {{ $t("users.address.district") }}
            </dt>
            <dd class="mt-0.5 truncate font-medium">
              {{ display(districtLabel(customer)) }}
            </dd>
          </div>
          <div class="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
            <dt class="text-xs text-muted-foreground">
              {{ $t("customers.viewModal.street") }}
            </dt>
            <dd class="mt-0.5 font-medium">
              {{ display(streetLabel(customer)) }}
            </dd>
          </div>
          <div
            v-if="hasCoordinates"
            class="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2"
          >
            <dt class="text-xs text-muted-foreground">
              {{ $t("customers.viewModal.coordinates") }}
            </dt>
            <dd class="mt-0.5 font-medium" dir="ltr">
              <a
                :href="mapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                {{ customer.latitude }}, {{ customer.longitude }}
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
import { Eye, User } from "lucide-vue-next";
import type { DisplayUserDTO } from "@/integration";
import { useLocalizedCityComposable } from "@/composables";

const props = defineProps<{
  customer: DisplayUserDTO;
}>();

const isOpen = ref(false);
const { cityLabel, districtLabel, streetLabel } = useLocalizedCityComposable();

const display = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return "--";
  return String(value);
};

const hasCoordinates = computed(
  () =>
    props.customer.latitude != null && props.customer.longitude != null,
);

const hasAddress = computed(
  () =>
    Boolean(
      cityLabel(props.customer) ||
        districtLabel(props.customer) ||
        streetLabel(props.customer) ||
        hasCoordinates.value,
    ),
);

const mapUrl = computed(() => {
  if (!hasCoordinates.value) return undefined;
  return `https://www.openstreetmap.org/?mlat=${props.customer.latitude}&mlon=${props.customer.longitude}#map=16/${props.customer.latitude}/${props.customer.longitude}`;
});
</script>
