<template>
  <Tippy
    interactive
    :hide-on-click="true"
    trigger="click"
    :delay="0"
    :duration="0"
    :placement="placement"
    :offset="offset"
    :maxWidth="matchTriggerContentWidth ? triggerWidth : undefined"
    @hide="emit('hide')"
  >
    <template #default>
      <div ref="triggerRef">
        <slot name="trigger" />
      </div>
    </template>

    <template #content="{ hide }">
      <div
        v-if="matchTriggerContentWidth"
        :style="{ width: `${triggerWidth}px` }"
      >
        <slot name="content" :hide="hide" />
      </div>
      <slot v-else name="content" :hide="hide" />
    </template>
  </Tippy>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Tippy } from "vue-tippy";
import { type Placement } from "tippy.js";

const props = withDefaults(
  defineProps<{
    matchTriggerContentWidth?: boolean;
    placement?: Placement;
    offset?: [number, number];
  }>(),
  { matchTriggerContentWidth: false, placement: "bottom", offset: () => [0, 0] }
);

const triggerRef = ref<HTMLElement | null>(null);
const triggerWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;

const emit = defineEmits<{
  (e: "hide"): void;
}>();

const updateWidth = () => {
  if (triggerRef.value) {
    triggerWidth.value = triggerRef.value.offsetWidth;
  }
};

onMounted(() => {
  if (!triggerRef.value || !props.matchTriggerContentWidth) {
    return;
  }
  resizeObserver = new ResizeObserver(updateWidth);
  resizeObserver.observe(triggerRef.value);
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<style>
.tippy-content {
  padding: 0;
}

.tippy-box {
  background-color: transparent;
  border: none;
  box-shadow: none;
}
</style>
