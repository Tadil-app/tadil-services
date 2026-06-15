# Android App Signing Requirements

To automate the building and signing of the Tadil Android application for production release (e.g., Google Play Store distribution), we require a Java Keystore from the developer.

Please provide the following items to the DevOps team. 

---

## 1. Cryptographic Assets Required

### A. Java Keystore File (`.jks` or `.keystore`)
This file securely holds the cryptographic key used to sign the Android app.
- **How to get it:**
  If you don't have one, you can generate it using Android Studio (Build > Generate Signed Bundle / APK > Create new...) or via the command line using `keytool`:
  ```bash
  keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
  ```
- **What to provide:** The `.jks` or `.keystore` file itself.

### B. Keystore Credentials
To access the key inside the keystore during the automated build, the following credentials must be provided:
1. **Keystore Password**: The password protecting the entire `.jks` file.
2. **Key Alias**: The name of the specific key stored inside the keystore.
3. **Key Password**: The password protecting the specific key (often the same as the Keystore Password, but can be different).

---

## 2. Instructions for the DevOps/GitHub Admin

Because GitHub Actions cannot natively store binary files like `.jks`, you must convert the keystore file to a `base64` text string before saving it as a GitHub Secret.

### Step-by-Step Encoding (macOS/Linux)

Open your terminal and run the following command on the file provided by the developer:

```bash
base64 -i path/to/my-release-key.jks | pbcopy
# Paste the copied string into the ANDROID_KEYSTORE_BASE64 GitHub Secret.
```

*(On Windows, you can use `certutil -encode path\to\my-release-key.jks encoded.txt` and copy the contents of `encoded.txt`)*

### GitHub Secrets to Configure

You must add the following variables in the repository settings (**Settings > Secrets and variables > Actions**):

| Secret Name | Description |
| :--- | :--- |
| `ANDROID_KEYSTORE_BASE64` | The base64-encoded string of the `.jks` or `.keystore` file. |
| `ANDROID_KEYSTORE_PASSWORD` | The password used to unlock the keystore file. |
| `ANDROID_KEY_ALIAS` | The alias of the key within the keystore. |
| `ANDROID_KEY_PASSWORD` | The password used to unlock the specific key alias. |