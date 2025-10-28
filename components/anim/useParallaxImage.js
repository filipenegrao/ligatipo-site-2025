"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function useParallaxImage(
  sectionRef,
  imageWrapperRef,
  amount = 10
) {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const imgEl = imageWrapperRef.current?.querySelector("img");
      if (!imgEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.set(imgEl, { willChange: "transform" });

      gsap.fromTo(
        imgEl,
        { y: `-${amount}%` },
        {
          y: `${amount}%`,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, imageWrapperRef, amount]);
}
