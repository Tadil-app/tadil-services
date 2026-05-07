import { ref } from "vue";

const isOpen = ref(false);
const toastVariant = ref<"default" | "destructive">("default");
const toastTitle = ref<string>();
const toastDescription = ref<string>();
const toastDetails = ref<string | string[]>();
const isToastDetailsOpen = ref<boolean>(false);

let timer: ReturnType<typeof setTimeout> | null = null;
let remaining = 0;
let endTime = 0;

export default function useToast() {
  function openToast(
    title?: string,
    description?: string,
    details?: string | string[],
    variant: "default" | "destructive" = "default"
  ) {
    if (!title && !description && !details) return;

    if (title) toastTitle.value = title;
    if (description) toastDescription.value = description;
    if (details) toastDetails.value = details;

    toastVariant.value = variant;
    isOpen.value = true;

    // reset timer
    if (timer) clearTimeout(timer);
    endTime = Date.now() + 5000;
    timer = setTimeout(() => closeToast(), 5000);
  }

  function closeToast() {
    isOpen.value = false;
    toastDetails.value = undefined;
    isToastDetailsOpen.value = false;
    toastTitle.value = undefined;
    toastDescription.value = undefined;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    remaining = 0;
  }

  function pauseToast() {
    if (!isOpen.value || !timer) return;
    clearTimeout(timer);
    timer = null;
    remaining = endTime - Date.now();
  }

  function resumeToast() {
    if (!isOpen.value || timer || remaining <= 0) return;
    endTime = Date.now() + remaining;
    timer = setTimeout(() => closeToast(), remaining);
    remaining = 0;
  }

  return {
    isOpen,
    toastVariant,
    toastTitle,
    toastDescription,
    toastDetails,
    isToastDetailsOpen,
    openToast,
    closeToast,
    pauseToast,
    resumeToast,
  };
}
