// RevenueCat configuration.
//
// Keys come from .env (local dev) or EAS environment variables (cloud builds):
//   EXPO_PUBLIC_REVENUECAT_IOS_KEY      — starts with "appl_"
//   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY  — starts with "goog_"
// These are the *public SDK keys* from RevenueCat → Project → API keys
// (NOT the secret key). See .env.example.
//
// PRO_ENTITLEMENT_ID must match the Entitlement identifier you created in
// RevenueCat (dashboard → Entitlements). Both products
// (hydrafy_pro_monthly + hydrafy_pro_yearly_1) should be attached to it.

export const REVENUECAT_API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? 'appl_REPLACE_WITH_YOUR_IOS_KEY',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? 'goog_REPLACE_WITH_YOUR_ANDROID_KEY',
};

// Must match the Entitlement *identifier* in RevenueCat EXACTLY (case + spaces).
export const PRO_ENTITLEMENT_ID = 'hy';

// Apple requires a custom paywall to link to your Terms (EULA) and Privacy
// Policy, and to disclose auto-renew terms. `terms` defaults to Apple's
// standard EULA; replace `privacy` with your own hosted privacy policy URL.
export const LEGAL = {
  terms: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacy: 'https://hariskhan317.github.io/hydrafy/privacy-policy.html',
};
