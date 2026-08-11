(() => {
  const covers = ["/images/koyuki/%E9%9B%AAKoyuki__2025_10%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki__2025_11%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_1%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_3%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_4%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_5%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_6%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_7%E6%9C%88.webp","/images/koyuki/%E9%9B%AAKoyuki_2026_8%E6%9C%88.webp"];
  const selector = [
    "#header img[fetchpriority='high']",
    ".post-cover img",
    ".article-nav-link-wrap img",
    ".post-categories-cover img",
  ].join(",");

  function getKey(image, index) {
    const linkedPath = image
      .closest(".post-wrap, .article-nav-link-wrap, .post-categories-wrap")
      ?.querySelector("a[href]")
      ?.getAttribute("href");
    return image.alt || linkedPath || location.pathname + ":" + index;
  }

  function readPrevious(key) {
    try {
      return sessionStorage.getItem("koyuki-cover:" + key);
    } catch {
      return null;
    }
  }

  function remember(key, cover) {
    try {
      sessionStorage.setItem("koyuki-cover:" + key, cover);
    } catch {
      // The random cover still works when browser storage is unavailable.
    }
  }

  function chooseCover(key, used) {
    const previous = readPrevious(key);
    let candidates = covers.filter(
      (cover) => cover !== previous && !used.has(cover),
    );
    if (candidates.length === 0) {
      candidates = covers.filter((cover) => cover !== previous);
    }
    if (candidates.length === 0) {
      candidates = covers;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function randomizeKoyukiCovers() {
    if (covers.length < 2) return;

    const images = [...document.querySelectorAll(selector)].filter((image) => {
      const isHeaderImage = image.closest("#header") !== null;
      const isKoyukiCover = (image.getAttribute("src") || "").includes(
        "/images/koyuki/",
      );
      return isHeaderImage || isKoyukiCover;
    });
    const assignments = new Map();
    const used = new Set();

    images.forEach((image, index) => {
      const key = getKey(image, index);
      if (!assignments.has(key)) {
        const cover = chooseCover(key, used);
        assignments.set(key, cover);
        used.add(cover);
        remember(key, cover);
      }

      const cover = assignments.get(key);
      image.closest("picture")?.querySelectorAll("source").forEach((source) => {
        source.srcset = cover;
      });
      image.src = cover;
      if (image.closest("#header") && window.REIMU_POST) {
        window.REIMU_POST.cover = cover;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", randomizeKoyukiCovers, {
      once: true,
    });
  } else {
    randomizeKoyukiCovers();
  }
  window.addEventListener("pjax:success", () =>
    requestAnimationFrame(randomizeKoyukiCovers),
  );
})();