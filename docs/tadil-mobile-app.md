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
