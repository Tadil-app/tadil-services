# Wallet & Payouts Core Library

## Overview
`tadil-wallet` handles all financial transactions, earning distributions, and withdrawal requests within the platform.

## Key Features
- **Earning Distribution**: Automatically calculates and credits commissions to the Tailor, the initial Courier, and the return Courier when an order is completed.
- **Transaction Ledger**: Logs all credits (earnings) and debits (payouts) for every service provider.
- **Payout Management**:
    - **Service Providers**: Can request withdrawals based on their available balance.
    - **Administrators**: Can fulfill (following bank transfer) or reject payout requests.
- **Configurable Money Rules**: Admins set them on the admin **Settings** page (`PlatformSettings`, one row; permissions `settings.read` / `settings.update`). A tailor can also have their own rate, which wins over the global one.

## Settings
| Setting | Use |
|---|---|
| Free delivery threshold (SAR) | Items total from which the transportation fee is 0. 0 = not set |
| Courier base payout (SAR per trip) | What a driver earns per trip (pickup and return are two trips) |
| Tailor commission (%) | Tailor's share of the items total, unless the tailor has their own rate |
| Delivery subsidy (% per trip, `courierCommissionRate`) | Share of the items total the platform puts toward the driver's pay, counted for both trips. Lowers the customer's fee; never paid to the driver |

## Transportation Fee
Charged when the order is created (`CreateOrderUseCase`, formula in `tadil-common` `transportationFee`):

- threshold set (> 0) and items total >= threshold: fee = 0
- otherwise: fee = max(0, base payout x 2 - items total x delivery subsidy % x 2)

Without a threshold the fee still reaches 0 on its own from base payout / subsidy % (7.5 / 6.5% = 115.38 SAR).

Example: base 7.5, subsidy 6.5%, items 100 SAR: (7.5 x 2) - (100 x 13%) = 2 SAR.
`Order.deliveryFee` stores the fee and `Order.totalPrice` is what the customer pays (items + fee).
Checkout shows it from `GET /customer/delivery-fee?itemsTotal=`.

## Earning Logic
Upon `confirmReceipt` by the Customer (`ConfirmReceiptUseCase`), with the settings at that moment:
1. Tailor: their rate (own, else global) x the items total (`totalPrice - deliveryFee`).
2. Each driver: the base payout per trip. A driver who did both trips is paid twice.
3. `CreditOrderEarningUseCase` adds each amount to the wallet and logs an `EARNING` transaction.

Tailor and driver order screens show the same amounts as `myEarning` (`apps/tadil-mobile-api/src/app/common/earnings.ts`).

## Location
`libs/core/tadil-wallet`
