"use client";
import styles from "./main-header.module.scss";
import Link from "next/link";

export default function MainHeader() {
  return (
    <>
      <header className={`${styles.header} header-main site-menu`}>
        <div className={`${styles["content-header"]}`}>
          <Link href="/" className={styles.logo}>
            ligatipo
          </Link>
          <nav className={`${styles.nav}`}>
            <ul className={`${styles.flex}`}>
              <li>
                <Link href="/our-team">nosso time</Link>
              </li>
              <li>
                <Link href="/what-we-do">o que fazemos</Link>
              </li>
              <li>
                <Link href="/what-we-do">fontes</Link>
              </li>
              <li>
                <Link href="/what-we-do">fontes custom</Link>
              </li>
              <li>
                <Link href="/fonts-in-use">fontes em uso</Link>
              </li>
              <li>
                <Link href="/contact">contato</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className={`${styles["line"]} site-line`}></div>
      </header>
    </>
  );
}
