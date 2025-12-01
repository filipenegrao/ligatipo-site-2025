"use client";
import { useEffect, useState, useRef } from "react";

export default function ScrollEffects() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    // Intersection Observer para mudança de cor
    const sections = document.querySelectorAll(".themed-section");
    const bgLayer = document.getElementById("bg-layer");
    const menu = document.querySelector(".site-menu");

    const observerOptions = {
      threshold: 0.5,
      rootMargin: "-20% 0px -20% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bgColor = entry.target.getAttribute("data-bg");
          const menuColor = entry.target.getAttribute("data-menu");
          const footer = document.querySelector(".footer-main");

          if (bgLayer && bgColor) {
            bgLayer.style.backgroundColor = bgColor;
          }
          if (menu && menuColor) {
            menu.style.color = menuColor;
          }
          if (footer && menuColor) {
            footer.style.color = menuColor;
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    // Scroll handler para hide/show UI
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const header = document.querySelector(".header-main");
      const footer = document.querySelector(".footer-main");

      setIsScrolling(true);

      // Hide UI durante scroll
      if (header) {
        header.style.transform = "translateY(-100%)";
        header.style.transition = "transform 0.3s ease";
      }
      if (footer) {
        footer.style.transform = "translateY(100%)";
        footer.style.transition = "transform 0.3s ease";
      }

      // Clear timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Show UI quando parar de scrollar
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        if (header) {
          header.style.transform = "translateY(0)";
        }
        if (footer) {
          footer.style.transform = "translateY(0)";
        }
      }, 150);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return null;
}
