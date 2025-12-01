"use client";
import ScrollEffects from "@/components/anim/ScrollEffects";
import MediaCarousel from "@/components/ui/MediaCarousel";
import styles from "./fonts-in-use.module.scss";
import imgTest1 from "@/assets/img/temp/img-test-1.png";
import imgTest2 from "@/assets/img/temp/img-test-2.png";
import imgTest3 from "@/assets/img/temp/img-test-3.png";
import imgTest4 from "@/assets/img/temp/img-test-4.png";

export default function FontsInUse() {
  // Exemplo de itens do carrossel
  const carouselItems = [
    {
      type: "image",
      src: imgTest1.src,
      alt: "Exemplo de fonte 1",
      caption: "Tipografia em uso - Exemplo 1",
    },
    {
      type: "image",
      src: imgTest2.src,
      alt: "Exemplo de fonte 2",
      caption: "Tipografia em uso - Exemplo 2",
    },
    {
      type: "image",
      src: imgTest3.src,
      alt: "Exemplo de fonte 3",
      caption: "Tipografia em uso - Exemplo 3",
    },
    {
      type: "image",
      src: imgTest4.src,
      alt: "Exemplo de fonte 4",
      caption: "Tipografia em uso - Exemplo 4",
    },
  ];

  return (
    <>
      <div
        id="bg-layer"
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#F8CDCC",
          transition: "background-color 0.8s ease",
        }}
      />
      <ScrollEffects />
      <main>
        <section
          className={`${styles["section-fonts-in-use"]} ${styles.section} themed-section`}
          data-bg="#F8CDCC"
          data-menu="#015958"
        >
          <div className={styles["section-content"]}>
            <h1 className={styles["section-header"]}>Fontes em Uso</h1>
            <div className={styles["fonts-in-use-items"]}>
              <MediaCarousel items={carouselItems} title="Fonte Exemplo" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
