import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import styles from "./admin-layout.module.scss";

export const metadata = {
  title: "Admin - Ligatipo",
  description: "Área administrativa do Ligatipo",
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminLayout}>
      <AdminHeader />
      <main className={styles.adminMain}>{children}</main>
      <AdminFooter />
    </div>
  );
}
