import styles from "./main-header.module.scss";
import Link from "next/link";

export default function MainHeader() {
  return (
    <>
      <header className={`${styles.header}`}>
        <div className={`${styles["content-header"]} site-menu`}>
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
            </ul>
          </nav>
        </div>
        <div className={`${styles["line"]} site-line`}></div>
      </header>
    </>
  );
}
