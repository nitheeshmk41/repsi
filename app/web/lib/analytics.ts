/**
 * Repsi SEO & Product Analytics Helper
 * Tracks search funnel conversion events for GA4 and custom telemetry.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type TrackableEvent =
  | "landing_page_view"
  | "feature_page_view"
  | "solution_page_view"
  | "pricing_view"
  | "compare_view"
  | "city_page_view"
  | "demo_click"
  | "start_free_click"
  | "register_start"
  | "register_complete"
  | "login";

export function trackEvent(eventName: TrackableEvent, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}
