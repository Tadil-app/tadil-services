export const currencyConfig: Record<
  string,
  { decimals: number; symbol: string; locale: string }
> = {
  USD: { decimals: 2, symbol: "$", locale: "en-US" },
  EUR: { decimals: 2, symbol: "€", locale: "fr-FR" },
  CAD: { decimals: 2, symbol: "$", locale: "en-CA" },
  TND: { decimals: 3, symbol: "د.ت", locale: "fr-FR" },
  GBP: { decimals: 2, symbol: "£", locale: "en-GB" },
};

export function formatMoney(
  amount: number,
  currency?: string,
  displayCurrency: boolean = true
): string {
  if (!currency) currency = "USD";
  const config = currencyConfig[currency];
  if (!config) return "";
  return new Intl.NumberFormat(config.locale, {
    style: displayCurrency ? "currency" : undefined,
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);
}

export function parseCurrencyInput(value: string, currency?: string): number {
  if (!currency) currency = "USD";
  const locale = currencyConfig[currency]?.locale || "en-US";
  const decimalSeparator =
    new Intl.NumberFormat(locale)
      .formatToParts(1.1)
      .find((part) => part.type === "decimal")?.value || ".";

  let sanitizedValue = value;

  const thousandSeparator = new Intl.NumberFormat(locale)
    .formatToParts(1000)
    .find((part) => part.type === "group")?.value;

  if (thousandSeparator) {
    const regex = new RegExp(`\\${thousandSeparator}`, "g");
    sanitizedValue = sanitizedValue.replace(regex, "");
  }

  if (decimalSeparator !== ".") {
    const regex = new RegExp(`\\${decimalSeparator}`);
    sanitizedValue = sanitizedValue.replace(regex, ".");
  }

  return parseFloat(sanitizedValue) || 0;
}
