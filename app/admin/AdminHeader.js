"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./AdminHeader.module.scss";

export default function AdminHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Ligatipo <span className={styles.admin}>Admin</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/admin/showcases" className={styles.navLink}>
            Showcases
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            Usuários
          </Link>
          <div className={styles.userSection}>
            {session?.user?.email && (
              <span className={styles.userName}>{session.user.email}</span>
            )}
            <button
              onClick={handleSignOut}
              className={`button ${styles.signOut}`}
            >
              Sair
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
