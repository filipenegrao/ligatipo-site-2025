"use client";
import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/components/anim/gsapClient";

export default function ThemeScrollController({
  sectionSelector = ".themed-section",
  bgLayerSelector = "#bg-layer",
  menuSelector = ".site-menu",
  start = "top 65%",
  end = "bottom 35%",
  ease = "power2.out",
}) {
  useLayoutEffect(() => {
    const bgEl = document.querySelector(bgLayerSelector);
    const menuEl = document.querySelector(menuSelector);
    if (!bgEl || !menuEl) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const durBG = prefersReduced ? 0.01 : 0.6;
    const durMenu = prefersReduced ? 0.01 : 0.4;

    const sections = gsap.utils.toArray(sectionSelector);

    // Anima imediatamente para a seção “mais visível” ao carregar
    const setInitial = () => {
      let best = null,
        bestArea = 0,
        vh = window.innerHeight;
      sections.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        const overlap = Math.max(
          0,
          Math.min(vh, r.bottom) - Math.max(0, r.top)
        );
        if (overlap > bestArea) {
          best = sec;
          bestArea = overlap;
        }
      });
      if (best) {
        const bg = best.getAttribute("data-bg") || "#fff";
        const menu = best.getAttribute("data-menu") || "#111";
        gsap.set(bgEl, { backgroundColor: bg });
        gsap.set(menuEl, { color: menu });
      }
    };

    setInitial();
    ScrollTrigger.getAll().forEach((t) => t.kill());

    sections.forEach((sec) => {
      const bg = sec.getAttribute("data-bg") || "#fff";
      const menu = sec.getAttribute("data-menu") || "#111";
      ScrollTrigger.create({
        trigger: sec,
        start,
        end,
        onEnter: () => {
          gsap.to(bgEl, { backgroundColor: bg, duration: durBG, ease });
          gsap.to(menuEl, { color: menu, duration: durMenu, ease });
        },
        onEnterBack: () => {
          gsap.to(bgEl, { backgroundColor: bg, duration: durBG, ease });
          gsap.to(menuEl, { color: menu, duration: durMenu, ease });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [sectionSelector, bgLayerSelector, menuSelector, start, end, ease]);

  return null;
}
