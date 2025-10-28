import Link from "next/link";
import styles from "./fixed-footer.module.scss";

export default function FixedFooter() {
  return (
    <>
      <div className={`${styles["fixed-footer"]} fixed-footer`}>
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
            </ul>
          </div>
          <form className={`${styles["newsletter-form"]} news-form`}>
            <input
              type="email"
              placeholder="Newsletter"
              className={`${styles["newsletter-input"]} news-input`}
              required
            />
            <button
              type="submit"
              className={`${styles["newsletter-btn"]} news-btn`}
            >
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
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
