"use client";
import { useEffect } from "react";

export default function useSectionTheme(selector = ".themed-section") {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    let currentBg, currentMenu;

    const apply = (bg, menu) => {
      if (bg && bg !== currentBg) {
        root.style.setProperty("--page-bg", bg);
        currentBg = bg;
      }
      if (menu && menu !== currentMenu) {
        root.style.setProperty("--menu-fg", menu);
        currentMenu = menu;
      }
    };

    // pref: reduz movimento
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      // ainda troca, só sem animação longa
      const style = document.createElement("style");
      style.innerHTML = `body{transition:none !important}.site-menu{transition:none !important}`;
      document.head.appendChild(style);
    }

    // Usa a seção mais visível (maior intersectionRatio)
    let mostVisible = null;

    const io = new IntersectionObserver(
      (entries) => {
        // pegue a com maior área visível
        mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) {
          const el = mostVisible.target;
          const bg = el.getAttribute("data-bg");
          const menu = el.getAttribute("data-menu");
          apply(bg, menu);
        }
      },
      {
        root: null,
        // aciona um pouco antes da troca, ajuste a gosto:
        rootMargin: "-10% 0px -10% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    document.querySelectorAll(selector).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}
