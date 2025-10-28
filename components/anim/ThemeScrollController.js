"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function ThemeScrollController() {
  useLayoutEffect(() => {
    const bg = document.querySelector("#bg-layer");
    const menu = document.querySelector(".site-menu");

    const footer = document.querySelector(".fixed-footer");
    const lines = document.querySelectorAll(".site-line");
    const newsForm = document.querySelector(".news-form");
    const newsInput = document.querySelector(".news-input");
    const newsBtn = document.querySelector(".news-btn");

    const sections = gsap.utils.toArray(".themed-section");

    if (!bg || !menu || sections.length === 0) return;

    // clear previous triggers to prevent duplicates during HMR
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // define initial state
    const vh = window.innerHeight;
    let best = null,
      bestArea = 0;
    sections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top));
      if (overlap > bestArea) {
        best = sec;
        bestArea = overlap;
      }
    });
    if (best) {
      gsap.set(bg, { backgroundColor: best.getAttribute("data-bg") || "#fff" });
      gsap.set(menu, { color: best.getAttribute("data-menu") || "#111" });
    }

    // triggers for transitions
    sections.forEach((sec) => {
      const bgColor = sec.getAttribute("data-bg") || "#fff";
      const menuColor = sec.getAttribute("data-menu") || "#111";
      ScrollTrigger.create({
        trigger: sec,
        start: "top 65%",
        end: "bottom 35%",
        // markers: true, // deixe ligado até funcionar
        onEnter: () => {
          gsap.to(bg, {
            backgroundColor: bgColor,
            duration: 0.8,
            ease: "power3.out",
          });
          gsap.to([menu, footer, lines, newsInput], {
            color: menuColor,
            duration: 0.55,
            ease: "power3.out",
            delay: 0.05,
          });
          gsap.to(newsBtn, {
            backgroundColor: menuColor,
            color: bgColor,
            duration: 0.55,
            ease: "power3.out",
            delay: 0.05,
          });
        },
        onEnterBack: () => {
          gsap.to(bg, {
            backgroundColor: bgColor,
            duration: 0.6,
            ease: "power3.out",
          }),
            gsap.to([menu, footer, lines, newsInput], {
              color: menuColor,
              duration: 0.4,
              ease: "power3.out",
            });
          gsap.to(newsBtn, {
            backgroundColor: menuColor,
            color: bgColor,
            duration: 0.4,
            ease: "power3.out",
          });
        },
      });
    });

    // refresh after images load
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []); // ← ESSENCIAL
  return null;
}
