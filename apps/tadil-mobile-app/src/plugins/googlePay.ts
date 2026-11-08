import { Capacitor, registerPlugin, WebPlugin } from "@capacitor/core";

export {
  GOOGLE_PAY_MERCHANT_ID,
  formatGooglePayAmount,
  googlePayEnabled,
  googlePayEnvironment,
  isGooglePayCanceled,
} from "./googlePay.util";

export interface GooglePayPlugin {
  isAvailable(options: GooglePayAvailability): Promise<{ available: boolean }>;
  pay(options: GooglePayRequest): Promise<GooglePayResult>;
}

export interface GooglePayAvailability {
  environment: "TEST" | "PRODUCTION";
}

export interface GooglePayRequest {
  merchantId: string;
  gatewayMerchantId: string;
  countryCode: string;
  currencyCode: string;
  label: string;
  amount: string;
  amountHalalas: number;
  description: string;
  publishableApiKey: string;
  orderId: string;
  environment: "TEST" | "PRODUCTION";
}

export interface GooglePayResult {
  id: string;
  status: string;
  message: string;
}

class GooglePayWeb extends WebPlugin implements GooglePayPlugin {
  async isAvailable(): Promise<{ available: boolean }> {
    return { available: false };
  }

  async pay(): Promise<GooglePayResult> {
    throw this.unimplemented("Google Pay is only available in the Android app");
  }
}

const GooglePay = registerPlugin<GooglePayPlugin>("GooglePay", {
  web: () => new GooglePayWeb(),
});

export function isNativeAndroid(): boolean {
  return Capacitor.getPlatform() === "android";
}

export async function nativeGooglePayAvailable(
  environment: "TEST" | "PRODUCTION"
): Promise<boolean> {
  if (!isNativeAndroid()) return false;
  try {
    const { available } = await GooglePay.isAvailable({ environment });
    return available === true;
  } catch {
    return false;
  }
}

export { GooglePay };
