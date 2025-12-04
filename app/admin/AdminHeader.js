"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./AdminHeader.module.scss";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className={styles.adminHeader}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Ligatipo <span className={styles.admin}>Admin</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/admin/showcases" className={styles.navLink}>
            Showcases
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            Usuários
          </Link>
          {session && (
            <div className={styles.userSection}>
              <span className={styles.userName}>{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className={`button ${styles.signOut}`}
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
