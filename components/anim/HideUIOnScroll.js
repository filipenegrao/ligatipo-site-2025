"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HideUIOnScroll() {
  useEffect(() => {
    let cleanup = null;

    // Aguarda o DOM estar pronto
    const initScrollTrigger = () => {
      const menu = document.querySelector(".site-menu");
      const footer = document.querySelector(".fixed-footer");
      const lines = document.querySelectorAll(".site-line");

      if (!menu || !footer) {
        // Se os elementos ainda não existem, tenta novamente em breve
        const timeoutId = setTimeout(initScrollTrigger, 100);
        cleanup = () => clearTimeout(timeoutId);
        return;
      }

      // Estado inicial
      gsap.set([menu, footer], { y: 0, opacity: 1 });

      const hideUI = () => {
        if (!menu || !footer) return;
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
        if (lines.length > 0) {
          gsap.to(lines, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const showUI = () => {
        if (!menu || !footer) return;
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
        if (lines.length > 0) {
          gsap.to(lines, {
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
            delay: 0.05,
          });
        }
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

      cleanup = () => {
        clearTimeout(endTimeout);
        ScrollTrigger.removeEventListener("scrollStart", onStart);
        ScrollTrigger.removeEventListener("scrollEnd", onEnd);

        // Mata animações GSAP nos elementos
        if (menu) gsap.killTweensOf(menu);
        if (footer) gsap.killTweensOf(footer);
        if (lines && lines.length > 0) gsap.killTweensOf(lines);
      };
    };

    initScrollTrigger();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return null;
}
