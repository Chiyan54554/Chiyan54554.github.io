(() => {
  const loader = document.currentScript;
  if (!loader || !document.querySelector("figure.highlight")) {
    return;
  }
  if (window.__lazyCodeToolsActive) {
    return;
  }
  window.__lazyCodeToolsActive = true;
  window.addEventListener(
    "pjax:send",
    () => {
      window.__lazyCodeToolsActive = false;
    },
    { once: true }
  );

  const clipboard = {
    src: "https://npm.webcache.cn/clipboard@2.0.11/dist/clipboard.min.js",
    integrity:
      "sha384-J08i8An/QeARD9ExYpvphB8BsyOj3Gh2TSh1aLINKO3L0cMSH2dN3E22zFoXEi0Q",
  };

  function loadScript(src, integrity) {
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

  window.__clipboardReady ||= loadScript(clipboard.src, clipboard.integrity).catch(
    (error) => {
      window.__clipboardReady = null;
      throw error;
    }
  );

  window.__clipboardReady
    .then(() => loadScript("/js/insert_highlight.js"))
    .catch((error) => console.error("Code tools failed to load.", error));
})();
