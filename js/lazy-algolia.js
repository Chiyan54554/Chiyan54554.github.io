(() => {
  const loader = document.currentScript;
  const button = document.getElementById("nav-search-btn");

  if (!loader || !button || window.__lazyAlgoliaSetup) {
    return;
  }
  window.__lazyAlgoliaSetup = true;

  const assets = [
    {
      src: loader.dataset.algoliaSrc,
      integrity: loader.dataset.algoliaIntegrity,
    },
    {
      src: loader.dataset.instantsearchSrc,
      integrity: loader.dataset.instantsearchIntegrity,
    },
    { src: loader.dataset.handlerSrc },
  ];
  let loaded = Boolean(window.algoliasearch && window.instantsearch);
  let loadPromise;

  function loadScript({ src, integrity }) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      if (integrity) {
        script.integrity = integrity;
        script.crossOrigin = "anonymous";
      }
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function ensureSearch() {
    if (loaded) {
      return Promise.resolve();
    }
    loadPromise ||= assets
      .reduce((chain, asset) => chain.then(() => loadScript(asset)), Promise.resolve())
      .then(() => {
        loaded = true;
      });
    return loadPromise;
  }

  function warmSearch() {
    ensureSearch().catch((error) => console.error("Search failed to load.", error));
  }

  ["pointerenter", "pointerdown", "focus"].forEach((eventName) => {
    button.addEventListener(eventName, warmSearch, { once: true, passive: true });
  });

  button.addEventListener(
    "click",
    async (event) => {
      if (loaded) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        await ensureSearch();
        button.click();
      } catch (error) {
        console.error("Search failed to load.", error);
      }
    },
    true
  );
})();
