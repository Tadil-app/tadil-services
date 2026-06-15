# Tadil Mobile App

## Overview
`tadil-mobile-app` is the primary interface for customers to request tailoring services and for tailors/couriers to manage their orders.

## Responsibilities
- Role-based routing and navigation guards (Customer, Tailor, Courier).
- Customer flow: Browsing models, requesting custom alterations, managing cart and checkout (with address selection and payment integration).
- Tailor flow: Dashboard with city-filtered orders, accepting/declining assignments, marking work as ready, and wallet management.
- Courier flow: Pickup and delivery management for both initial and return trips.
- Visual Order Progress: Vertical timeline in order details views showing status history timestamps.
- Multi-language support (English, Arabic, Bengali, Hindi, Urdu).

## Key Features & Optimizations

### Guest Mode & Smart Routing
The app supports unauthenticated browsing to maximize conversion rates.
- **Unrestricted Catalog:** Guests can browse predefined and custom models, and build their cart without logging in.
- **Smart Redirects:** The Vue Router intercepts protected actions (like proceeding to checkout). It redirects the user to the login screen, appending a `?redirect` query parameter, ensuring they are seamlessly returned to their intended destination post-login.
- **Defensive UI:** Protected views (like the Dashboard) use `onIonViewWillEnter` to block unauthorized background API calls during fast Ionic tab transitions, providing an `EmptyState` prompt for guests.

### Payment Integration (Moyasar 3DS)
The app integrates Moyasar for payment processing using a seamless "Hybrid Inline" approach to handle 3D Secure (3DS) authentication without reloading the Vue SPA.
- **Inline Rendering:** The standard credit card form renders natively within the DOM (`CheckoutView.vue`).
- **3DS Interception:** If a card requires 3DS verification, the `on_completed` callback intercepts the `initiated` status and securely opens the bank's `transaction_url` using the `@capacitor/inappbrowser` overlay.
- **Local Interception:** The form sets a dummy local URL (`window.location.origin + '/payment-callback'`) as the callback. The app listens for a `urlChangeEvent` to this specific URL, allowing it to instantly extract the payment parameters and close the WebView overlay without ever hitting the external network or flashing a blank screen.

### Real-time Communication (Order Chat)
A full-featured chat system integrated into the order management flow.
- **Dual Channels**: Separate, private chat rooms for "Customer-Tailor" and "Customer-Courier" coordination.
- **Multimedia Support**: Standard text messages, voice recordings with a built-in player, and camera-integrated image sharing.
- **WebSockets**: Leverages `socket.io-client` for immediate, refresh-free communication.

### Local-First Image Storage
To minimize server load and improve performance, user-uploaded images for **Custom Models** are stored locally on the device's filesystem (`Directory.Data`) while items are in the cart.
- **Just-in-Time Upload**: Images are only uploaded to the platform API at the final stage of order creation.
- **Selective Processing**: The app automatically skips processing for predefined models (admin-created), as their assets are already hosted on the server.
- **Automatic Cleanup**: Temporary local files are deleted immediately after a successful checkout.

### Custom vs. Predefined Items
The app distinguishes between two primary ordering paths:
1. **Predefined Models**: Uses a hierarchical structure of `sections` and `alterations`.
2. **Custom Models**: Uses a flat list of `alterations` with `customCoordinates` representing user pinpoints on their uploaded photo.

## Tech Stack
- Vue 3 (Composition API)
- Ionic Framework
- Capacitor
- Tailwind CSS

## Location
`apps/tadil-mobile-app`
