/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TADIL_MOBILE_API_URL?: string;
  readonly VITE_MOYASAR_PUBLISHABLE_KEY?: string;
  readonly VITE_GOOGLE_PAY_MERCHANT_ID?: string;
  readonly VITE_GOOGLE_MAPS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
