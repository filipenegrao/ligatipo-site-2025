"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./fixed-footer.module.scss";

export default function FixedFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles["fixed-footer"]} footer-main`}>
        <div className="site-line"></div>
        <div className={styles["footer-content"]}>
          <div className="social-media">
            <ul className={styles["social-media-list"]}>
              <Link
                href="https://www.instagram.com/ligatipo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <li>IN</li>
              </Link>
              <Link
                href="https://www.linkedin.com/company/ligatipo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <li>LI</li>
              </Link>
              <Link
                href="https://ligatipo.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <li>SB</li>
              </Link>
            </ul>
          </div>
          <form
            className={`${styles["newsletter-form"]} news-form`}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder={
                status === "success"
                  ? "Inscrição realizada!"
                  : status === "error"
                  ? "Erro :( Tente novamente."
                  : "Newsletter"
              }
              className={`${styles["newsletter-input"]} news-input ${
                status === "success"
                  ? styles["success-state"]
                  : status === "error"
                  ? styles["error-state"]
                  : ""
              }`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || status !== null}
            />
            <button
              type="submit"
              className={`${styles["newsletter-btn"]} news-btn`}
              disabled={loading || status !== null}
            >
              {loading ? (
                "..."
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
