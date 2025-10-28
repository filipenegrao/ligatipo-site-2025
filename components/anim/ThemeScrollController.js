"use client";
import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/components/anim/gsapClient";

export default function ThemeScrollController() {
  useLayoutEffect(() => {
    const bg = document.querySelector("#bg-layer");
    const menu = document.querySelector(".site-menu");
    const sections = gsap.utils.toArray(".themed-section");
    if (!bg || !menu || !sections.length) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach((t) => t.kill());

    sections.forEach((sec) => {
      const color = sec.getAttribute("data-bg");
      const menuColor = sec.getAttribute("data-menu");
      ScrollTrigger.create({
        trigger: sec,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          gsap.to(bg, { backgroundColor: color, duration: 0.8 });
          gsap.to(menu, { color: menuColor, duration: 0.6 });
        },
        onEnterBack: () => {
          gsap.to(bg, { backgroundColor: color, duration: 0.8 });
          gsap.to(menu, { color: menuColor, duration: 0.6 });
        },
      });
    });
  }, []);
  return null;
}
