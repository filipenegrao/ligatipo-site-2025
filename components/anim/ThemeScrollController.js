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
    const newsInput = document.querySelector(".news-input");
    const newsBtn = document.querySelector(".news-btn");
    const sections = gsap.utils.toArray(".themed-section");
    const introSection = document.querySelector(".intro-section");
    const middleLine = document.querySelector(".mid-line");

    console.log("intro: ", introSection, "mid line: ", middleLine);

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

    // Small dwell/pause when a section hits the top (pin briefly)
    // Adjust dwellPx for longer/shorter pause; applied only on desktop for better UX.
    if (window.innerWidth >= 768) {
      const dwellPx = 50;
      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: `+=${dwellPx}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
      });
    }

    // Middle line fade in on intro
    if (introSection && middleLine) {
      console.log("Setting up middle line animation");
      gsap.set(middleLine, {
        transformOrigin: "bottom center",
        willChange: "transform",
      });
      // Controls to tune speed:
      //  - data-line-span on the section: multiplier of viewport height used for the animation distance (default 1.0)
      //  - data-line-scrub on the section: seconds of smoothing (scrub) – higher = feels slower (default 0 = instant follow)
      const spanAttr = parseFloat(
        introSection.getAttribute("data-line-span") || "1.0"
      );
      const scrubAttr = parseFloat(
        introSection.getAttribute("data-line-scrub") || "0"
      );
      const spanFactor = isNaN(spanAttr) ? 1.0 : spanAttr; // e.g., 0.6 faster, 1.2 slower
      const scrubValue = !isNaN(scrubAttr) && scrubAttr > 0 ? scrubAttr : true; // true follows scroll; number adds smoothing
      gsap.fromTo(
        middleLine,
        { scaleY: 1 },
        {
          scaleY: 0,
          ease: "none",
          scrollTrigger: {
            trigger: introSection,
            start: "top top",
            end: () => "+=" + Math.max(1, window.innerHeight * spanFactor),
            scrub: scrubValue,
            // markers: true,
          },
        }
      );
    }

    // // Snap to sections
    // sections.forEach((sec) => {
    //   ScrollTrigger.create({
    //     trigger: sec,
    //     start: "top top",
    //     end: "bottom top",
    //     scroller: window,
    //     // markers: true,
    //     snap: {
    //       snapTo: 1,
    //       duration: 0.65,
    //       ease: "power3.out",
    //     },
    //   });
    // });

    // refresh after images load
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []); // ← ESSENCIAL
  return null;
}
