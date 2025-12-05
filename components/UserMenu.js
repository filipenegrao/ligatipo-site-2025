"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./UserMenu.module.scss";

export default function UserMenu({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleAdminPanel = () => {
    router.push("/admin");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={styles.trigger}>{children}</button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.content}
          sideOffset={5}
          alignOffset={-20}
          align="end"
        >
          {session ? (
            <>
              <div className={styles.userInfo}>
                <p className={styles.userName}>
                  {session.user.name || session.user.email}
                </p>
                {session.user.role && (
                  <span className={styles.userRole}>{session.user.role}</span>
                )}
              </div>
              <DropdownMenu.Separator className={styles.separator} />
              {(session.user.role === "ADMIN" ||
                session.user.role === "EMPLOYEE") && (
                <DropdownMenu.Item
                  className={styles.item}
                  onSelect={handleAdminPanel}
                >
                  Painel Admin
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                className={styles.item}
                onSelect={handleSignOut}
              >
                Sair
              </DropdownMenu.Item>
            </>
          ) : (
            <DropdownMenu.Item className={styles.item} onSelect={handleLogin}>
              Fazer Login
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Arrow className={styles.arrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
