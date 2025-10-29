"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HideUIOnScroll() {
  useLayoutEffect(() => {
    const menu = document.querySelector(".site-menu");
    const footer = document.querySelector(".fixed-footer");
    const lines = document.querySelectorAll(".site-line");

    if (!menu && !footer && (!lines || lines.length === 0)) return;

    // Estado inicial
    gsap.set([menu, footer], { y: 0, opacity: 1 });

    const hideUI = () => {
      gsap.to(menu, {
        y: -24,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(footer, {
        y: 24,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(lines, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const showUI = () => {
      gsap.to(menu, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
        delay: 0.05,
      });
      gsap.to(footer, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
        delay: 0.05,
      });
      gsap.to(lines, {
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
        delay: 0.05,
      });
    };

    // Debounce (impede a UI de ficar piscando com scroll muito leve)
    let endTimeout;
    const onStart = () => {
      clearTimeout(endTimeout);
      hideUI();
    };
    const onEnd = () => {
      clearTimeout(endTimeout);
      endTimeout = setTimeout(showUI, 120);
    };

    ScrollTrigger.addEventListener("scrollStart", onStart);
    ScrollTrigger.addEventListener("scrollEnd", onEnd);

    return () => {
      ScrollTrigger.removeEventListener("scrollStart", onStart);
      ScrollTrigger.removeEventListener("scrollEnd", onEnd);
    };
  }, []);

  return null;
}
