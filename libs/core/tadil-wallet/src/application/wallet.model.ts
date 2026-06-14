export const TRANSACTION_TYPE = {
  EARNING: 'EARNING',
  PAYOUT: 'PAYOUT',
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPE;

export const PAYOUT_STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
} as const;

export type PayoutStatus = keyof typeof PAYOUT_STATUS;

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  type: TransactionType;
  date: string;
  userId: string;
  orderId?: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: PayoutStatus;
  date: string;
  userId: string;
}

export interface PayoutRequestUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface PendingPayoutRequest extends PayoutRequest {
  user: PayoutRequestUser;
}

export interface WalletDetails {
  balance: number;
  transactions: Transaction[];
  payoutRequests: PayoutRequest[];
}
