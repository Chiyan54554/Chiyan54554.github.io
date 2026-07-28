(() => {
  const imageLinkPattern = /\.(?:png|jpe?g|gif|webp|svg|bmp|ico|avif)(?:[?#].*)?$/i;

  function isElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
  }

  function isProtectedTarget(target) {
    return isElement(target) && Boolean(
      target.closest("img, picture, .article-gallery-item, .image-download-guard-link")
    );
  }

  function lockImage(img) {
    if (!(img instanceof HTMLImageElement) || img.dataset.downloadLocked === "true") {
      return;
    }

    img.dataset.downloadLocked = "true";
    img.draggable = false;
    img.classList.add("image-download-guard");

    const anchor = img.closest("a");
    if (!anchor) {
      return;
    }

    const href = anchor.getAttribute("href") || "";
    if (
      anchor.classList.contains("article-gallery-item") ||
      imageLinkPattern.test(href)
    ) {
      anchor.removeAttribute("href");
      anchor.removeAttribute("target");
      anchor.classList.add("image-download-guard-link");
      anchor.setAttribute("aria-disabled", "true");
    }
  }

  function protectImages(root = document) {
    if (!isElement(root) && root !== document) {
      return;
    }

    if (root instanceof HTMLImageElement) {
      lockImage(root);
      return;
    }

    root.querySelectorAll("img").forEach(lockImage);
  }

  function blockEvent(event) {
    if (!isProtectedTarget(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  ["contextmenu", "dragstart", "selectstart", "copy"].forEach((eventName) => {
    document.addEventListener(eventName, blockEvent, true);
  });

  document.addEventListener(
    "click",
    (event) => {
      const link = isElement(event.target)
        ? event.target.closest("a.image-download-guard-link, a.article-gallery-item")
        : null;
      if (!link) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!isElement(node)) {
          return;
        }
        protectImages(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  protectImages();
  window.addEventListener("pjax:success", () => protectImages());
})();
