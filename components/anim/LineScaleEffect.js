"use client";
import { useEffect } from "react";

export default function LineScaleEffect() {
  useEffect(() => {
    const line = document.querySelector(".mid-line");
    if (!line) return;

    const handleScroll = () => {
      const lineRect = line.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const headerHeight = 80; // 5rem = 80px

      // Calcular quanto da linha está visível
      const lineTop = lineRect.top;
      const lineBottom = lineRect.bottom;

      // Quando a linha está no topo da viewport (abaixo do header), deve desaparecer completamente
      // Quando está no centro/baixo, deve estar totalmente visível
      let opacity = 1;

      if (lineTop < headerHeight) {
        // Linha está saindo pela parte superior (considerando a margem do header)
        const visibleHeight = lineBottom - headerHeight;
        const totalHeight = lineRect.height;
        opacity = Math.max(0, Math.min(1, visibleHeight / totalHeight));
      }

      line.style.opacity = opacity;
      line.style.transition = "opacity 0.1s linear";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Executar uma vez no mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
