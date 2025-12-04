"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./showcases.module.scss";

export default function ShowcasesIndex() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_BASE || "";
        const res = await fetch(`${base}/showcases?page=1&pageSize=50`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setList(data.data ?? []);
        setError(null);
      } catch (e) {
        setError(e.message ?? "Erro ao carregar showcases");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Showcases</h1>
      {loading && <div className={styles.loading}>Carregando…</div>}
      {error && <div className={styles.error}>Erro: {error}</div>}
      {!loading && !error && (
        <ul className={styles.grid}>
          {list.map((item) => (
            <li key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{item.title}</h3>
                {item.publishedAt && (
                  <span className={styles.published}>{item.publishedAt}</span>
                )}
              </div>
              {item.designer && (
                <div className={styles.meta}>por {item.designer}</div>
              )}
              <div className={styles.actions}>
                <Link
                  href={`/fonts-in-use?id=${encodeURIComponent(item.id)}`}
                  className={styles.link}
                >
                  Abrir showcase
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
