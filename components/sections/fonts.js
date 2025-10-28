import styles from "./fonts.module.scss";
import FontCards from "../complements/font-cards";

export default function Fonts() {
  return (
    <section
      className={`${styles["fonts-section"]} ${
        styles.section
      } ${"themed-section"}`}
      data-bg="#FFDD44"
      data-menu="#015958"
    >
      <div className={styles["section-content"]}>
        <h2 className={styles["section-header"]}>Nossas Fontes</h2>
      </div>
      <div className={styles["fonts-container"]}>
        {/* Ar Sans – 8 pesos (estática) */}
        <FontCards
          icon="↗"
          font_name="'Ar Sans', sans-serif"
          label="Ar Sans"
          samples={[
            { text: "Transitional", weight: 100 },
            { text: "Peppermint", weight: 200 },
            { text: "Untroubled", weight: 300 },
            { text: "Busybodies", weight: 400 },
            { text: "Effeminacy", weight: 500 },
            { text: "Roommate", weight: 600 },
            { text: "Scorecards", weight: 700 },
            { text: "Inalienable", weight: 800 },
          ]}
        />

        {/* Leluja – variável (exemplo com pesos intermediários via 'wght') */}
        <FontCards
          icon="🖐"
          font_name="'Leluja', serif"
          label="Leluja Original"
          samples={[
            { text: "Heterologous", variation: 320 },
            { text: "Commonsense", variation: 430 },
            { text: "Persuasions", variation: 560 },
            { text: "Representable", variation: 680 },
          ]}
        />

        {/* Olar – 1 peso */}
        <FontCards
          icon="✶"
          font_name="'Olar 1.0', sans-serif"
          label="Olar 1.0"
          samples={[{ text: "TEXTUALLY", weight: 400 }]}
        />
      </div>
    </section>
  );
}
