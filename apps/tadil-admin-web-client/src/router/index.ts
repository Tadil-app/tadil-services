import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layout/Layout.vue"),
    redirect: "/required-informations",
    children: [
      {
        path: "/required-informations",
        component: () =>
          import("@/views/informations/InformationsListingView.vue"),
      },
      {
        path: "/alterations",
        component: () =>
          import("@/views/alterations/AlterationsListingView.vue"),
      },
      {
        path: "/extras",
        component: () => import("@/views/extras/ExtrasListingView.vue"),
      },
      {
        path: "/models",
        component: () => import("@/views/models/ModelsListingView.vue"),
      },
      {
        path: "/users",
        component: () => import("@/views/users/UsersManagementView.vue"),
      },
      {
        path: "/login-requests",
        component: () => import("@/views/users/LoginRequestsView.vue"),
      },
      {
        path: "/payout-requests",
        component: () => import("@/views/users/PayoutRequestsView.vue"),
      },
      {
        path: "/orders",
        component: () => import("@/views/orders/OrdersManagementView.vue"),
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
