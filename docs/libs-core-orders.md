# Orders Core Library

## Overview
`tadil-orders` manages the foundational logic for the tailoring order lifecycle, from initial creation to final delivery confirmation.

## Key Features
- **10-State Lifecycle**: Implements transitions across a detailed workflow including tailor assignment, courier pickup, tailoring, and return trips.
- **Automated Assignment**: Logic for matching orders with available service providers (to be fully automated in future phases).
- **Manual Overrides**: Admin capabilities to manually assign tailors to pending orders.
- **Payment Verification**: Integration with payment gateways (e.g., Moyasar) to confirm order fulfillment.

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
10. `done`: Customer confirmed receipt.

## Location
`libs/core/tadil-orders`
