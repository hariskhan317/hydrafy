// Thin wrapper around RevenueCat (react-native-purchases). All SDK touchpoints
// live here so screens only deal with `isPro` (from the store) plus a few
// actions: getOffering(), purchasePackage(), restore().
//
// We render our OWN paywall (src/screens/Paywall.js) instead of RevenueCat's
// prebuilt UI, so nothing needs to be designed in the dashboard — but you DO
// still need an Offering (with packages) and the `pro` Entitlement there.

import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { REVENUECAT_API_KEYS, PRO_ENTITLEMENT_ID } from './config';

// True when a CustomerInfo has the Pro entitlement active.
export function isProFromInfo(info) {
  return !!info?.entitlements?.active?.[PRO_ENTITLEMENT_ID];
}

// True when a usable API key has been configured.
export function isConfigured() {
  const apiKey = Platform.select(REVENUECAT_API_KEYS);
  return !!apiKey && !apiKey.includes('REPLACE_WITH');
}

// Configure the SDK once on app launch and listen for entitlement changes.
// `onChange(isPro)` fires with the initial state and on every update
// (purchase, restore, expiry, renewal).
export async function initPurchases(onChange) {
  if (!isConfigured()) {
    // No key yet — run as a free user instead of crashing so the app still boots.
    console.warn('[purchases] RevenueCat API key not set; skipping configure().');
    onChange(false);
    return;
  }

  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: Platform.select(REVENUECAT_API_KEYS) });

  Purchases.addCustomerInfoUpdateListener((info) => onChange(isProFromInfo(info)));

  try {
    const info = await Purchases.getCustomerInfo();
    onChange(isProFromInfo(info));
  } catch (e) {
    onChange(false);
  }
}

// The "current" offering configured in RevenueCat, or null if none/unconfigured.
// `offering.availablePackages` holds the Monthly / Annual packages to show.
export async function getOffering() {
  if (!isConfigured()) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings?.current ?? null;
  } catch (e) {
    return null;
  }
}

// Buy a package. Returns { ok, isPro, cancelled, error }.
export async function purchasePackage(pkg) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { ok: true, isPro: isProFromInfo(customerInfo) };
  } catch (e) {
    if (e?.userCancelled) return { ok: false, cancelled: true };
    return { ok: false, error: e?.message || 'Something went wrong. Please try again.' };
  }
}

// Restore prior purchases (App Store account). Returns the resulting Pro state.
export async function restore() {
  try {
    const info = await Purchases.restorePurchases();
    return isProFromInfo(info);
  } catch (e) {
    return false;
  }
}
