import styles from "./font-cards.module.scss";

export default function FontCards({ icon, font_name, samples = [], label }) {
  return (
    <div className={styles["font-cards"]}>
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
