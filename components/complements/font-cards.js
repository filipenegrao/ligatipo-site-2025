import React, { useRef } from "react";
import styles from "./font-cards.module.scss";

export default function FontCards({ icon, font_name, samples = [], label }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const rotateX = (mouseY - centerY) / 10;
    const rotateY = (centerX - mouseX) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
  };

  return (
    <div
      ref={cardRef}
      className={styles["font-cards"]}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
  );
}
