"use client";
import { useRef, useEffect } from "react";
import styles from "./font-cards.module.scss";

export default function FontCards({ icon, font_name, samples = [], label }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const inner = cardElement.querySelector(`.${styles["card-inner"]}`);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const maxTilt = 10; // ajuste aqui se quiser mais/menos movimento

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * (maxTilt * 2);
      const rotX = (0.5 - py) * (maxTilt * 2);
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };

    const reset = () => {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div className={styles["font-cards"]}>
      <div className={styles["card-inner"]}>
        <div className={styles["card-header"]}>
          <div className={styles["line-left"]}></div>
          <div className={styles["icon"]}>{icon}</div>
          <div className={styles["line-right"]}></div>
        </div>

        <div className={styles["card-body"]}>
          {samples.map((s, i) => (
            <div
              key={i}
              className={styles["font-text"]}
              style={{
                fontFamily: font_name,
                ...(s.weight ? { fontWeight: s.weight } : {}),
                ...(s.variation
                  ? { fontVariationSettings: `'wght' ${s.variation}` }
                  : {}),
              }}
            >
              {s.text}
            </div>
          ))}
        </div>

        <div className={styles["divider"]}></div>
        <div className={styles["font-name"]}>{label ?? font_name}</div>
      </div>
    </div>
  );
}
