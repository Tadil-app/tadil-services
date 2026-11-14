import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tadil.app",
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
    FirebaseMessaging: {
      // While the app is open, iOS plays the sound and the app shows its own
      // banner (see src/push); a second system banner would be noise.
      presentationOptions: ["sound", "badge"],
    },
  },
  experimental: {
    ios: {
      spm: {
        packageOptions: {
          // Avoids a SwiftPM package identity collision with the Firebase SDK.
          "@capacitor-firebase/messaging": { symlink: true },
        },
      },
    },
  },
};

export default config;
