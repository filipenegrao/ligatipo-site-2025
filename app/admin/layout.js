"use client";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./admin-layout.module.scss";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
      <div className={styles.adminLayout}>
        <AdminHeader />
        <main className={styles.adminMain}>{children}</main>
        <AdminFooter />
      </div>
    </ProtectedRoute>
  );
}
