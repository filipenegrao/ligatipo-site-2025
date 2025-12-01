"use client";
import ScrollEffects from "@/components/anim/ScrollEffects";
import MediaCarousel from "@/components/ui/MediaCarousel";
import styles from "./fonts-in-use.module.scss";
// Temporary: local import fallback kept for dev; fetch used below
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function FontsInUse() {
  const searchParams = useSearchParams();
  const showcaseId = searchParams.get("id") ?? "example-1";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showcase, setShowcase] = useState(null);

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/showcases?id=${encodeURIComponent(showcaseId)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setShowcase(data);
        setError(null);
      } catch (e) {
        setError(e.message ?? "Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    };
    fetchShowcase();
  }, [showcaseId]);

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
              {loading && (
                <div className={styles.skeletonContainer}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonBlock} />
                </div>
              )}
              {error && <div>Erro: {error}</div>}
              {showcase && (
                <MediaCarousel
                  items={showcase.items}
                  title={showcase.title}
                  projectInfo={{
                    title: showcase.title,
                    designer: showcase.designer,
                    publishedAt: showcase.publishedAt,
                    contactUrl: showcase.contactUrl,
                    contactLabel: showcase.contactLabel,
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
