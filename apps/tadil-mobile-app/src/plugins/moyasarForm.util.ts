export function moyasarFormMethods(options: {
  nativeApp: boolean;
  googlePay: boolean;
}): string[] {
  // STC Pay is phone + OTP inside the Moyasar form, so it works in the
  // WebView. Apple Pay / Google Pay cannot start a native wallet session
  // from Capacitor; those stay as platform plugins on iOS / Android.
  if (options.nativeApp) return ["creditcard", "stcpay"];
  const methods = ["creditcard", "stcpay", "applepay"];
  if (options.googlePay) methods.push("googlepay");
  return methods;
}
