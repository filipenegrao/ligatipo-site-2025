import styles from "./AdminFooter.module.scss";

export default function AdminFooter() {
  return (
    <footer className={styles.adminFooter}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} Ligatipo - Área Administrativa</p>
      </div>
    </footer>
  );
}
