"use client";
import { useSession } from "next-auth/react";
import styles from "./main-header.module.scss";
import Link from "next/link";
import UserMenu from "./UserMenu";

export default function MainHeader() {
  const { data: session } = useSession();

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
            <div className={styles["user-icons"]}>
              <span
                className={`icon ${styles["icon-bag"]} ${styles["icon-header"]}`}
                title="Showcases"
              >
                b
              </span>
              <UserMenu>
                <span
                  className={`icon ${styles["icon-user"]} ${styles["icon-header"]}`}
                  title="Usuário"
                >
                  u
                </span>
              </UserMenu>
            </div>
          </nav>
        </div>
        <div className={`${styles["line"]} site-line`}></div>
      </header>
    </>
  );
}
