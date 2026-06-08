import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { name: "customer-dashboard" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LogInView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileSettingsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/customer",
    name: "customer",
    component: () => import("../views/customer/CustomerLayout.vue"),
    redirect: { name: "customer-dashboard" },
    meta: { requiresAuth: true, role: "customer" },
    children: [
      {
        path: "dashboard",
        name: "customer-dashboard",
        component: () => import("../views/customer/DashboardView.vue"),
      },
      {
        path: "orders",
        name: "customer-orders-history",
        component: () => import("../views/customer/OrdersHistoryView.vue"),
      },
      {
        path: "orders/:orderId",
        name: "customer-order-details",
        props: true,
        component: () => import("../views/customer/OrderDetailsView.vue"),
      },
      {
        path: "cart",
        name: "customer-cart",
        component: () => import("../views/customer/cart/CartView.vue"),
      },
      {
        path: "cart/:itemId",
        name: "customer-cart-item-details",
        props: true,
        component: () => import("../views/customer/cart/CartItemDetailsView.vue"),
      },
      {
        path: "checkout",
        name: "customer-checkout",
        component: () => import("../views/customer/checkout/CheckoutView.vue"),
      },
      {
        path: "checkout/verify",
        name: "customer-checkout-verify",
        component: () => import("../views/customer/checkout/CheckoutVerifyView.vue"),
      },
      {
        path: "new-order",
        name: "customer-new-order",
        component: () => import("../views/customer/newOrder/NewOrderView.vue"),
        redirect: { name: "customer-new-order-category-selection" },
        children: [
          {
            path: "category-selection",
            name: "customer-new-order-category-selection",
            component: () =>
              import("../views/customer/newOrder/CategorySelectionView.vue"),
          },
          {
            path: ":category/model-type-selection",
            name: "customer-new-order-model-type-selection",
            props: true,
            component: () =>
              import("../views/customer/newOrder/ModelTypeSelectionView.vue"),
          },
          {
            path: ":category/predefined",
            name: "customer-new-order-predefined",
            props: true,
            component: () =>
              import(
                "../views/customer/newOrder/predefinedModel/PredefinedModelView.vue"
              ),
            redirect: { name: "customer-new-order-predefined-model-selection" },
            children: [
              {
                path: "model-selection",
                name: "customer-new-order-predefined-model-selection",
                props: true,
                component: () =>
                  import(
                    "../views/customer/newOrder/predefinedModel/ModelSelectionView.vue"
                  ),
              },
              {
                path: ":modelId/model-gallery",
                name: "customer-new-order-predefined-model-gallery",
                props: true,
                component: () =>
                  import(
                    "../views/customer/newOrder/predefinedModel/ModelGalleryView.vue"
                  ),
              },
            ],
          },
          {
            path: ":category/custom-model",
            name: "customer-new-order-custom",
            props: true,
            component: () =>
              import(
                "../views/customer/newOrder/customModel/CustomModelView.vue"
              ),
            redirect: { name: "customer-new-order-custom-category-selection" },
            children: [
              {
                path: "custom-category-selection",
                name: "customer-new-order-custom-category-selection",
                props: true,
                component: () =>
                  import(
                    "../views/customer/newOrder/customModel/CustomModelCategorySelectionView.vue"
                  ),
              },
              {
                path: "upload",
                name: "customer-new-order-custom-upload",
                props: true,
                component: () =>
                  import(
                    "../views/customer/newOrder/customModel/CustomModelUploadView.vue"
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/tailor",
    name: "tailor",
    component: () => import("../views/tailor/TailorLayout.vue"),
    redirect: { name: "tailor-dashboard" },
    meta: { requiresAuth: true, role: "tailor" },
    children: [
      {
        path: "dashboard",
        name: "tailor-dashboard",
        component: () => import("../views/tailor/DashboardView.vue"),
      },
      {
        path: "orders",
        name: "tailor-orders",
        component: () => import("../views/tailor/OrdersView.vue"),
      },
      {
        path: "orders/:orderId",
        name: "tailor-orders-details",
        props: true,
        component: () => import("../views/tailor/OrderDetailsView.vue"),
      },
      {
        path: "wallet",
        name: "tailor-wallet",
        component: () => import("../views/tailor/WalletView.vue"),
      },
    ],
  },
  {
    path: "/courier",
    name: "courier",
    component: () => import("../views/courier/CourierLayout.vue"),
    redirect: { name: "courier-dashboard" },
    meta: { requiresAuth: true, role: "courier" },
    children: [
      {
        path: "dashboard",
        name: "courier-dashboard",
        component: () => import("../views/courier/CourierDashboardView.vue"),
      },
      {
        path: "orders",
        name: "courier-orders",
        component: () => import("../views/courier/CourierOrdersView.vue"),
      },
      {
        path: "orders/:id",
        name: "courier-order-details",
        props: true,
        component: () => import("../views/courier/CourierOrderDetailsView.vue"),
      },
      {
        path: "wallet",
        name: "courier-wallet",
        component: () => import("../views/courier/CourierWalletView.vue"),
      },
    ],
  },
];

import { useAuthStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 1. Ensure auth is initialized from storage
  if (!authStore.userId && !from.name) {
    await authStore.initAuth();
  }

  const isAuthenticated = !!authStore.token;
  const userRole = authStore.userRole;

  // 2. Handle guest-only routes (like /login)
  if (to.meta.guestOnly && isAuthenticated) {
    if (userRole === "tailor") return next({ name: "tailor-dashboard" });
    if (userRole === "courier") return next({ name: "courier-dashboard" });
    return next({ name: "customer-dashboard" });
  }

  // 3. Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "login" });
  }

  // 4. Handle role-based access
  if (to.meta.role && to.meta.role !== userRole) {
    if (userRole === "tailor") return next({ name: "tailor-dashboard" });
    if (userRole === "courier") return next({ name: "courier-dashboard" });
    if (userRole === "customer") return next({ name: "customer-dashboard" });
  }

  // 5. Handle root path specifically
  if (to.path === "/") {
    if (isAuthenticated) {
      if (userRole === "tailor") return next({ name: "tailor-dashboard" });
      if (userRole === "courier") return next({ name: "courier-dashboard" });
      return next({ name: "customer-dashboard" });
    } else {
      return next({ name: "login" });
    }
  }

  next();
});

export default router;
