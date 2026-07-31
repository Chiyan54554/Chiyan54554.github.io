const loaders = Array.from(
  document.querySelectorAll('script[src="/js/lazy-photoswipe.js"]')
);
const loader = loaders[loaders.length - 1];

if (loader && !loader.dataset.initialized) {
  loader.dataset.initialized = "true";
  const assets = {
    css: {
      src: "https://npm.webcache.cn/photoswipe@5.4.4/dist/photoswipe.css",
      integrity:
        "sha384-IfxC36XL/toUyJ939C73PcgMuRzAZuIzZxE38drsmO5p6jD7ei+Zx/1oA/0l8ysE",
    },
    lightbox: {
      src: "https://npm.webcache.cn/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.min.js",
      integrity:
        "sha384-DiL6M/gG+wmTxmCRZyD1zee6lIhawn5TGvED0FOh7fXcN9B0aZ9dexSF/N6lrZi/",
    },
    core: {
      src: "https://npm.webcache.cn/photoswipe@5.4.4/dist/photoswipe.esm.min.js",
      integrity:
        "sha384-WkkO3GCmgkC3VQWpaV8DqhKJqpzpF9JoByxDmnV8+oTJ7m3DfYEWX1fu1scuS4+s",
    },
  };
  const gallerySelectors = [".article-entry", ".article-gallery"];
  const galleries = gallerySelectors
    .map((selector) => ({ selector, element: document.querySelector(selector) }))
    .filter(
      ({ element }) =>
        element?.querySelector("a.article-gallery-item") &&
        !element.dataset.photoswipeLoading &&
        !element.dataset.photoswipeReady
    );

  if (galleries.length) {
    galleries.forEach(({ element }) => {
      element.dataset.photoswipeLoading = "true";
    });
    if (!document.querySelector(`link[href="${assets.css.src}"]`)) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = assets.css.src;
      stylesheet.integrity = assets.css.integrity;
      stylesheet.crossOrigin = "anonymous";
      document.head.appendChild(stylesheet);
    }

    try {
      const { default: PhotoSwipeLightbox } = await window.safeImport(
        assets.lightbox.src,
        assets.lightbox.integrity
      );

      galleries.forEach(({ selector, element }) => {
        delete element.dataset.photoswipeLoading;
        element.dataset.photoswipeReady = "true";
        new PhotoSwipeLightbox({
          gallery: selector,
          children: "a.article-gallery-item",
          pswpModule: () =>
            window.safeImport(assets.core.src, assets.core.integrity),
        }).init();
      });
    } catch (error) {
      galleries.forEach(({ element }) => {
        delete element.dataset.photoswipeLoading;
      });
      console.error("PhotoSwipe failed to load.", error);
    }
  }
}
