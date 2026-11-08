import { Capacitor, registerPlugin, WebPlugin } from "@capacitor/core";

export { APPLE_PAY_MERCHANT_ID, formatApplePayAmount, isApplePayCanceled } from "./applePay.util";

export interface ApplePayPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  pay(options: ApplePayRequest): Promise<ApplePayResult>;
}

export interface ApplePayRequest {
  merchantId: string;
  countryCode: string;
  currencyCode: string;
  label: string;
  amount: string;
  amountHalalas: number;
  description: string;
  publishableApiKey: string;
  orderId: string;
}

export interface ApplePayResult {
  id: string;
  status: string;
  message: string;
}

class ApplePayWeb extends WebPlugin implements ApplePayPlugin {
  async isAvailable(): Promise<{ available: boolean }> {
    return { available: false };
  }

  async pay(): Promise<ApplePayResult> {
    throw this.unimplemented("Apple Pay is only available in the iOS app");
  }
}

const ApplePay = registerPlugin<ApplePayPlugin>("ApplePay", {
  web: () => new ApplePayWeb(),
});

export function isNativeIos(): boolean {
  return Capacitor.getPlatform() === "ios";
}

export async function nativeApplePayAvailable(): Promise<boolean> {
  if (!isNativeIos()) return false;
  try {
    const { available } = await ApplePay.isAvailable();
    return available === true;
  } catch {
    return false;
  }
}

export { ApplePay };
