# Tadil Courier Logic

## Overview
The `libs/core/tadil-courier` library contains the domain logic and business rules for the courier services in the Tadil platform. It manages order assignments, pickups, and deliveries.

## Use Cases
- **AcceptCourierAssignmentUseCase**: Allows a courier to accept a delivery assignment (initial or return trip).
- **DeclineCourierAssignmentUseCase**: Allows a courier to decline a delivery assignment.
- **ConfirmPickupUseCase**: Confirms that the courier has picked up the items from the customer or tailor.
- **MarkAsDeliveredUseCase**: Marks that the courier has arrived at the destination and is waiting for recipient confirmation.

## Repository Interface
- **CourierRepository**: Defines the contract for data persistence related to courier actions.

## Location
`libs/core/tadil-courier`
