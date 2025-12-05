"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/",
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role;

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      router.push(redirectTo);
      return;
    }
  }, [session, status, router, redirectTo, allowedRoles, userRole]);

  if (status === "loading") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>
    );
  }

  if (!session) {
    return null;
  }

  // Check role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
