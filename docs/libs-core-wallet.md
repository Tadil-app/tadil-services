# Wallet & Payouts Core Library

## Overview
`tadil-wallet` handles all financial transactions, earning distributions, and withdrawal requests within the platform.

## Key Features
- **Earning Distribution**: Automatically calculates and credits commissions to the Tailor, the initial Courier, and the return Courier when an order is completed.
- **Transaction Ledger**: Logs all credits (earnings) and debits (payouts) for every service provider.
- **Payout Management**:
    - **Service Providers**: Can request withdrawals based on their available balance.
    - **Administrators**: Can fulfill (following bank transfer) or reject payout requests.
- **Configurable Commissions**: Support for per-user commission rates set by Administrators.

## Earning Logic
Upon `confirmReceipt` by the Customer:
1. The system invokes `CreditOrderEarningUseCase`.
2. It calculates the share for each party (default 10% each, or custom tailor rate).
3. It creates a `Transaction` of type `EARNING` for each recipient.
4. It updates the corresponding user's `Wallet` balance.

## Location
`libs/core/tadil-wallet`
