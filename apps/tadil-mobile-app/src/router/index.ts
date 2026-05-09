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
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileSettingsView.vue"),
  },
  {
    path: "/customer",
    name: "customer",
    component: () => import("../views/customer/CustomerLayout.vue"),
    redirect: { name: "customer-dashboard" },
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
