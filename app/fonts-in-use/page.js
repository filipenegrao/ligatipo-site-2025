"use client";
import ScrollEffects from "@/components/anim/ScrollEffects";
import MediaCarousel from "@/components/ui/MediaCarousel";
import styles from "./fonts-in-use.module.scss";
// Temporary: local import fallback kept for dev; fetch used below
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function FontsInUse() {
  const searchParams = useSearchParams();
  const showcaseId = searchParams.get("id") ?? null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showcases, setShowcases] = useState([]);

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_BASE || "";
        // When using external backend (base set), use path param /showcases/:id
        // Otherwise fallback to local mock API with query param
        const url = base
          ? showcaseId
            ? `${base}/showcases/${encodeURIComponent(showcaseId)}`
            : `${base}/showcases`
          : showcaseId
          ? `/api/showcases?id=${encodeURIComponent(showcaseId)}`
          : `/api/showcases`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Normalize legacy image paths from backend seeds to local public assets
        const normalizeSrc = (src) => {
          if (typeof src !== "string") return src;
          // Prefix backend base for uploaded media served by backend
          if (src.startsWith("/uploads/")) {
            return base ? `${base}${src}` : src;
          }
          const match = src.match(/^\/img\/temp\/img-test-(\d)\.png$/);
          if (match) {
            return `/showcases/img-test-${match[1]}.png`;
          }
          return src;
        };
        if (Array.isArray(data.data)) {
          // list response (some backends omit items on list)
          const initialList = data.data.map((sc) => ({
            ...sc,
            items: Array.isArray(sc.items) ? sc.items : [],
          }));

          // If items are missing/empty, fetch detail per id to populate
          const base = process.env.NEXT_PUBLIC_API_BASE || "";
          const withItems = await Promise.all(
            initialList.map(async (sc) => {
              if (Array.isArray(sc.items) && sc.items.length > 0) {
                return sc;
              }
              try {
                const detailUrl = base
                  ? `${base}/showcases/${encodeURIComponent(sc.id)}`
                  : `/api/showcases?id=${encodeURIComponent(sc.id)}`;
                const resDetail = await fetch(detailUrl);
                if (!resDetail.ok) throw new Error("detail fetch failed");
                const d = await resDetail.json();
                return { ...sc, items: Array.isArray(d.items) ? d.items : [] };
              } catch {
                return sc; // keep as-is if detail fails
              }
            })
          );

          const normalizedList = withItems.map((sc) => ({
            ...sc,
            items: Array.isArray(sc.items)
              ? sc.items.map((it) => ({ ...it, src: normalizeSrc(it.src) }))
              : [],
          }));

          setShowcases(normalizedList);
        } else {
          // detail response
          const normalized = {
            ...data,
            items: Array.isArray(data.items)
              ? data.items.map((it) => ({ ...it, src: normalizeSrc(it.src) }))
              : [],
          };
          setShowcases([normalized]);
        }
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
        {loading && (
          <section
            className={`${styles["section-fonts-in-use"]} ${styles.section} themed-section`}
            data-bg="#F8CDCC"
            data-menu="#015958"
          >
            <div className={styles["section-content"]}>
              <h1 className={styles["section-header"]}>Fontes em Uso</h1>
              <div className={styles.skeletonContainer}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonBlock} />
              </div>
            </div>
          </section>
        )}

        {!loading && error && (
          <section
            className={`${styles["section-fonts-in-use"]} ${styles.section} themed-section`}
            data-bg="#F8CDCC"
            data-menu="#015958"
          >
            <div className={styles["section-content"]}>
              <h1 className={styles["section-header"]}>Fontes em Uso</h1>
              <div>Erro: {error}</div>
            </div>
          </section>
        )}

        {!loading &&
          !error &&
          Array.isArray(showcases) &&
          showcases.length > 0 &&
          showcases.map((sc, idx) => (
            <section
              key={sc.id ?? idx}
              className={`${styles["section-fonts-in-use"]} ${styles.section} themed-section`}
              data-bg="#F8CDCC"
              data-menu="#015958"
            >
              <div className={styles["section-content"]}>
                {idx === 0 ? (
                  <h1 className={styles["section-header"]}>Fontes em Uso</h1>
                ) : (
                  <h2
                    className={styles["section-header"]}
                    style={{ visibility: "hidden" }}
                  >
                    Fontes em Uso
                  </h2>
                )}
                <div className={styles["fonts-in-use-items"]}>
                  <MediaCarousel
                    items={sc.items}
                    title={sc.title}
                    invertHeader={idx % 2 === 1}
                    projectInfo={{
                      title: sc.title,
                      designer: sc.designer,
                      publishedAt: sc.publishedAt,
                      contactUrl: sc.contactUrl,
                      contactLabel: sc.contactLabel,
                    }}
                  />
                </div>
              </div>
            </section>
          ))}
      </main>
    </>
  );
}
