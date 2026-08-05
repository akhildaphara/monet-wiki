# Google OAuth Consent Screen Verification Guide

To remove the **"Unverified App"** warning for Google Sign-In users on iOS, submit your app for verification in Google Cloud Console using the dedicated Application Overview & OAuth Data Disclosure page.

---

## Pre-Requisites (Already Live)

- ✅ **Application Homepage URL:** `https://tapmonet.com` (Public homepage clearly stating Monet's purpose)
- ✅ **Application Information URL:** `https://tapmonet.com/app-info` (Dedicated page detailing app purpose and Google data usage)
- ✅ **Privacy Policy URL:** `https://tapmonet.com/privacy`
- ✅ **Terms of Service URL:** `https://tapmonet.com/terms`
- ✅ **App Icon:** `raw/swift-app/MonetApp/Assets.xcassets/AppIcon.appiconset/AppIcon.png` (1024x1024)
- ✅ **OAuth Client ID:** `729586971535-7gifo7a9hb0ue2k708mrdnasnbeqt6h5.apps.googleusercontent.com`

---

## Step-by-Step Submission Instructions

1. Open [Google Cloud Console - OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent?project=monet-3d69d).
2. Confirm your project **`monet-3d69d`** is selected in the top bar.
3. Fill out/update the **OAuth Consent Screen** fields:
   - **App name:** `Monet`
   - **User support email:** Select your developer email address
   - **App logo:** Upload `raw/swift-app/MonetApp/Assets.xcassets/AppIcon.appiconset/AppIcon.png`
   - **App domain -> Application homepage link:** `https://tapmonet.com`
   - **App domain -> Application privacy policy link:** `https://tapmonet.com/privacy`
   - **App domain -> Application terms of service link:** `https://tapmonet.com/terms`
   - **Authorized domains:** Add `tapmonet.com`, `web.app`, and `firebaseapp.com`
   - **Developer contact information:** Enter your developer email address
4. Click **Save and Continue**.
5. On the **Scopes Screen**:
   - Verify non-sensitive scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
   - Click **Save and Continue**.
6. Click **Prepare for Verification** at the bottom of the page.
7. Confirm that the information is accurate, then click **Submit for Verification**.

Verification for non-sensitive standard scopes takes **24–48 hours** with no fee required.
