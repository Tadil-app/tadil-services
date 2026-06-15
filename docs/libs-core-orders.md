# Orders Core Library

## Overview
`tadil-orders` manages the foundational logic for the tailoring order lifecycle, from initial creation to final delivery confirmation.

## Key Features
- **10-State Lifecycle**: Implements transitions across a detailed workflow including tailor assignment, courier pickup, tailoring, and return trips.
- **Automated Assignment**: Logic for matching orders with available service providers (to be fully automated in future phases).
- **Manual Overrides**: Admin capabilities to manually assign tailors to pending orders.
- **Payment Verification**: Defines the `PaymentGateway` interface. The `ConfirmPaymentUseCase` strictly validates the reported payment `id` and the expected `amount` against this interface before allowing an order to transition from `pending`.

## Status Flow
1. `pending`: Order created, awaiting payment.
2. `waitingForTailorAssignement`: Paid, awaiting tailor acceptance.
3. `waitingForCourierAssignement`: Tailor assigned, awaiting courier for pickup from customer.
4. `waitingForPickupFromCustomer`: Courier assigned, trip in progress.
5. `waitingForDropoffToTailor`: Items picked up, being delivered to tailor.
6. `inProgress`: Tailor received items and is working.
7. `waitingForReturnCourierAssignement`: Work finished, awaiting courier for return trip.
8. `waitingForPickupFromTailor`: Return courier assigned, heading to tailor.
9. `waitingForDropoffToCustomer`: Items picked up from tailor, being delivered back.
- `done`: Customer confirmed receipt.

## Data Persistence & Metadata
- **Metadata Snapshots**: When an order is created, the system snapshots the names (in all languages) and image IDs of the models and sections. This ensures the order record remains accurate even if the original model definition is updated by an Admin later.
- **Custom Item Support**: The library explicitly handles `CustomOrderItem` entities, which store user-uploaded images and pinpoint-based alterations, separate from the standard `OrderItem` entities used for predefined models.
- **Audit Logging**: Every status transition is automatically recorded in the `OrderStatusHistory` table with a nanosecond-precision timestamp for later analysis and UI visualization.

## Location

`libs/core/tadil-orders`
