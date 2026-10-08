declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const trackPageView = (path: string) => {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: "page_view",
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

export const trackEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
) => {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: eventName,
    ...parameters,
  });
};