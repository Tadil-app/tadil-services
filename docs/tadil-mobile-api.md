# Tadil Mobile API

## Overview
`tadil-mobile-api` is the NestJS-based backend application responsible for serving the Mobile App (`tadil-mobile-app`).

## Responsibilities
- Authenticating mobile users via phone number.
- Serving pre-defined and custom models for customers.
- Handling the complete order lifecycle across 10 states with automated history tracking.
- Orchestrating multi-party commission distribution (Customer -> Tailor/Couriers) upon order completion.
- Managing city-based order visibility and routing for tailors and couriers.
- Providing wallet balance and payout request management for service providers.
- **Real-time Communication**: Implements a Socket.io WebSocket Gateway for instant message delivery and room management (per order and per role).
- **Media Processing**: Specialized endpoints for uploading voice recordings and images for chat, with automated URL mapping.

## Location
`apps/tadil-mobile-api`
