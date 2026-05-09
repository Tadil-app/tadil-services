<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Payout Requests</h1>
      <p class="text-muted-foreground">Manage withdrawal requests from tailors and couriers.</p>
    </div>

    <div class="bg-card rounded-lg border shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase bg-muted/50">
            <tr>
              <th class="px-6 py-4 font-medium">User</th>
              <th class="px-6 py-4 font-medium">Amount</th>
              <th class="px-6 py-4 font-medium">Date</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="isLoading">
              <td colspan="4" class="px-6 py-10 text-center text-muted-foreground">
                <Loader2 class="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading...
              </td>
            </tr>
            <tr v-else-if="requests.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-muted-foreground">
                No pending payout requests.
              </td>
            </tr>
            <tr v-for="req in requests" :key="req.id" class="hover:bg-muted/30 transition-colors">
              <td class="px-6 py-4 font-medium">
                {{ req.user?.firstName }} {{ req.user?.lastName }}
                <span class="text-xs text-muted-foreground block">{{ req.user?.phone }}</span>
              </td>
              <td class="px-6 py-4">{{ req.amount }} SAR</td>
              <td class="px-6 py-4 text-xs">{{ formatDate(req.date) }}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <Button variant="outline" size="sm" @click="handleFulfill(req.id)" :disabled="isProcessing === req.id">
                  Fulfill
                </Button>
                <Button variant="destructive" size="sm" @click="handleReject(req.id)" :disabled="isProcessing === req.id">
                  Reject
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "@/integration";
import Button from "@/components/ui/Button.vue";
import { Loader2 } from "lucide-vue-next";

const requests = ref<any[]>([]);
const isLoading = ref(true);
const isProcessing = ref<string | null>(null);

const fetchRequests = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.payoutRequestsControllerGetPending();
    requests.value = response.data;
  } catch (error) {
    console.error("Failed to fetch payout requests", error);
  } finally {
    isLoading.value = false;
  }
};

const handleFulfill = async (id: string) => {
  if (!confirm("Have you completed the bank transfer? This will deduct the user's balance.")) return;
  isProcessing.value = id;
  try {
    await apiClient.payoutRequestsControllerFulfill(id);
    await fetchRequests();
  } catch (error) {
    console.error("Failed to fulfill request", error);
  } finally {
    isProcessing.value = null;
  }
};

const handleReject = async (id: string) => {
  if (!confirm("Are you sure you want to reject this request?")) return;
  isProcessing.value = id;
  try {
    await apiClient.payoutRequestsControllerReject(id);
    await fetchRequests();
  } catch (error) {
    console.error("Failed to reject request", error);
  } finally {
    isProcessing.value = null;
  }
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

onMounted(fetchRequests);
</script>
