import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { name: "customer-new-order-category-selection" },
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
    redirect: { name: "customer-new-order-category-selection" },
    children: [
      {
        path: "dashboard",
        name: "customer-dashboard",
        component: () => import("../views/customer/DashboardView.vue"),
        meta: { requiresAuth: true, role: "customer" },
      },
      {
        path: "orders",
        name: "customer-orders-history",
        component: () => import("../views/customer/OrdersHistoryView.vue"),
        meta: { requiresAuth: true, role: "customer" },
      },
      {
        path: "orders/:orderId",
        name: "customer-order-details",
        props: true,
        component: () => import("../views/customer/OrderDetailsView.vue"),
        meta: { requiresAuth: true, role: "customer" },
      },
      {
        path: "cart",
        name: "customer-cart",
        component: () => import("../views/customer/cart/CartView.vue"),
        meta: { requiresAuth: true, role: "customer" },
      },
      {
        path: "cart/:itemId",
        name: "customer-cart-item-details",
        props: true,
        component: () => import("../views/customer/cart/CartItemDetailsView.vue"),
        meta: { requiresAuth: true, role: "customer" },
      },
      {
        path: "checkout",
        name: "customer-checkout",
        component: () => import("../views/customer/checkout/CheckoutView.vue"),
        meta: { requiresAuth: true, role: "customer" },
      },
      {
        path: "checkout/verify",
        name: "customer-checkout-verify",
        component: () => import("../views/customer/checkout/CheckoutVerifyView.vue"),
        meta: { requiresAuth: true, role: "customer" },
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
                meta: { requiresAuth: true, role: "customer" },
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
                path: "upload/:customCategory",
                name: "customer-new-order-custom-upload",
                props: true,
                meta: { requiresAuth: true, role: "customer" },
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

function getDashboardRoute(role?: string) {
  if (role === "tailor") return { name: "tailor-dashboard" };
  if (role === "courier") return { name: "courier-dashboard" };
  return { name: "customer-dashboard" };
}

const guestEntryRouteNames = new Set([
  "customer-new-order-category-selection",
  "login",
]);

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.userId && !from.name) {
    await authStore.initAuth();
  }

  const isAuthenticated = !!authStore.token;
  const userRole = authStore.userRole;
  const isInitialNavigation = !from.name;

  if (isInitialNavigation && isAuthenticated && guestEntryRouteNames.has(to.name as string)) {
    return next(getDashboardRoute(userRole));
  }

  if (to.meta.guestOnly && isAuthenticated) {
    const redirect = to.query.redirect as string | undefined;
    if (redirect?.startsWith("/")) {
      return next(redirect);
    }
    return next(getDashboardRoute(userRole));
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  if (to.meta.role && isAuthenticated && to.meta.role !== userRole) {
    return next(getDashboardRoute(userRole));
  }

  next();
});

export default router;
