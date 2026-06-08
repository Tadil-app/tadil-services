import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "Tadil-تعديل",
  webDir: "dist",
  server: {
    allowNavigation: ["*"]
  },
  plugins: {
    StatusBar: {
      style: "DEFAULT",
      overlaysWebView: false,
    },
    SystemBars: {
      insetsHandling: "css",
    },
  },
};

export default config;
