# iOS App Signing Requirements

To automate the building and signing of the Tadil iOS application for distribution to real devices (via Diawi or Apple TestFlight), we require specific cryptographic assets from an active Apple Developer account.

Please provide the following items to the development team. 

---

## 1. Cryptographic Assets Required

### A. iOS Distribution Certificate (`.p12` file)
This certificate proves the identity of the developer signing the app.
- **How to get it:**
  1. Open **Keychain Access** on the Mac where the certificate was created.
  2. Locate the certificate under **My Certificates** (it usually starts with "Apple Distribution:" or "iPhone Distribution:").
  3. Right-click and select **Export**.
  4. Choose the **Personal Information Exchange (.p12)** format.
  5. Provide a strong password to protect the exported file.
- **What to provide:** The `.p12` file AND the password used to protect it.

### B. Provisioning Profile (`.mobileprovision` file)
This file tells Apple that the app is allowed to run on certain devices or be uploaded to the App Store.
- **How to get it:**
  1. Go to the [Apple Developer Portal](https://developer.apple.com/account/resources/profiles/list).
  2. Navigate to **Profiles**.
  3. Create a new profile or download an existing one. 
     - **For Diawi (Ad-Hoc):** Select "Ad Hoc" distribution. **Crucial:** You *must* register the specific UDIDs of the client's and colleague's iPhones in the "Devices" section and ensure they are checked when generating this Ad-Hoc profile.
     - **For TestFlight (App Store):** Select "App Store" distribution. No UDIDs are needed.
- **What to provide:** The `.mobileprovision` file.

### C. App Store Connect API Key (Optional, for TestFlight Auto-Upload)
If you want the GitHub Action to automatically upload the signed app directly to TestFlight, we need an API key.
- **How to get it:**
  1. Go to [App Store Connect](https://appstoreconnect.apple.com/).
  2. Navigate to **Users and Access** -> **Integrations** -> **App Store Connect API**.
  3. Generate a new key with **App Manager** access.
- **What to provide:** 
  1. The **Issuer ID** (found near the top of the page).
  2. The **Key ID** for the specific key.
  3. The downloaded `.p8` private key file.

---

## 2. Instructions for the DevOps/GitHub Admin

Because GitHub Actions cannot natively store binary files like `.p12` or `.mobileprovision`, you must convert them to `base64` text strings before saving them as GitHub Secrets.

### Step-by-Step Encoding (macOS/Linux)

Open your terminal and run the following commands on the files provided by the developer:

1. **Encode the Certificate:**
   ```bash
   base64 -i path/to/certificate.p12 | pbcopy
   # Paste the copied string into the BUILD_CERTIFICATE_BASE64 GitHub Secret.
   ```

2. **Encode the Provisioning Profile:**
   ```bash
   base64 -i path/to/profile.mobileprovision | pbcopy
   # Paste the copied string into the BUILD_PROVISION_PROFILE_BASE64 GitHub Secret.
   ```

### GitHub Secrets to Configure

You must add the following variables in the repository settings (**Settings > Secrets and variables > Actions**):

| Secret Name | Description |
| :--- | :--- |
| `BUILD_CERTIFICATE_BASE64` | The base64-encoded string of the `.p12` file. |
| `P12_PASSWORD` | The password used when exporting the `.p12` file. |
| `BUILD_PROVISION_PROFILE_BASE64` | The base64-encoded string of the `.mobileprovision` file. |
| `KEYCHAIN_PASSWORD` | A temporary password used by the GitHub runner (e.g., `temp_password_123`). You create this; it just needs to exist. |
| `APP_STORE_CONNECT_ISSUER_ID` | (Optional) Issuer ID for TestFlight upload. |
| `APP_STORE_CONNECT_KEY_IDENTIFIER` | (Optional) Key ID for TestFlight upload. |
| `APP_STORE_CONNECT_PRIVATE_KEY` | (Optional) The raw text content of the `.p8` file. |