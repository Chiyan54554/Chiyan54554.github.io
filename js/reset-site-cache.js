(() => {
  const resetParameter = "site-cache-reset";

  async function clearLegacyCache() {
    const resetUrl = new URL(window.location.href);
    const isResetNavigation = resetUrl.searchParams.has(resetParameter);

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    if (navigator.serviceWorker?.controller && !isResetNavigation) {
      resetUrl.searchParams.set(resetParameter, Date.now().toString());
      window.location.replace(resetUrl.toString());
      return;
    }

    if (isResetNavigation) {
      resetUrl.searchParams.delete(resetParameter);
      window.history.replaceState(null, "", resetUrl.toString());
    }
  }

  clearLegacyCache().catch(() => {
    // Random covers continue to work even if storage APIs are unavailable.
  });
})();
