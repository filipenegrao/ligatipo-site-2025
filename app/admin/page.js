"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/admin/StatCard";
import ActivityCard from "@/components/admin/ActivityCard";
import styles from "./dashboard.module.scss";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalShowcases: 0,
    totalUsers: 0,
    recentShowcases: 0,
    activeUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_API_BASE || "";

      // Buscar showcases
      const showcasesRes = await fetch(`${base}/showcases?page=1&pageSize=100`);
      const showcasesData = showcasesRes.ok
        ? await showcasesRes.json()
        : { data: [], meta: { total: 0 } };

      // Buscar usuários (somente admin)
      let usersData = { data: [], meta: { total: 0 } };
      if (session?.user?.role === "ADMIN") {
        const usersRes = await fetch(`${base}/users`);
        usersData = usersRes.ok ? await usersRes.json() : usersData;
      }

      // Calcular estatísticas
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentShowcases = showcasesData.data.filter((s) => {
        const createdAt = new Date(s.createdAt);
        return createdAt >= thirtyDaysAgo;
      }).length;

      const activeUsers = usersData.data.filter((u) => {
        const createdAt = new Date(u.createdAt);
        return createdAt >= thirtyDaysAgo;
      }).length;

      setStats({
        totalShowcases: showcasesData.meta?.total || showcasesData.data.length,
        totalUsers: usersData.meta?.total || usersData.data.length,
        recentShowcases,
        activeUsers,
      });

      // Criar atividades recentes baseadas nos dados
      const activities = [];

      // Adicionar showcases recentes
      showcasesData.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .forEach((showcase) => {
          activities.push({
            type: "showcase",
            description: `Showcase "${showcase.title}" foi criado`,
            timestamp: showcase.createdAt,
          });
        });

      // Adicionar usuários recentes (se admin)
      if (session?.user?.role === "ADMIN") {
        usersData.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
          .forEach((user) => {
            activities.push({
              type: "user",
              description: `Novo usuário: ${user.email}`,
              timestamp: user.createdAt,
            });
          });
      }

      // Ordenar por data
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1>Dashboard</h1>
            <p className={styles.welcome}>
              Bem-vindo, {session?.user?.name || session?.user?.email}
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <>
            <div className={styles.stats}>
              <StatCard
                title="Total de Showcases"
                value={stats.totalShowcases}
                icon="🎨"
                trend={stats.recentShowcases > 0 ? "up" : null}
                trendValue={
                  stats.recentShowcases > 0
                    ? `+${stats.recentShowcases} nos últimos 30 dias`
                    : null
                }
              />
              <StatCard
                title="Total de Usuários"
                value={stats.totalUsers}
                icon="👥"
                trend={stats.activeUsers > 0 ? "up" : null}
                trendValue={
                  stats.activeUsers > 0
                    ? `+${stats.activeUsers} nos últimos 30 dias`
                    : null
                }
              />
              <StatCard
                title="Showcases Recentes"
                value={stats.recentShowcases}
                icon="📈"
              />
              <StatCard
                title="Usuários Ativos"
                value={stats.activeUsers}
                icon="✨"
              />
            </div>

            <div className={styles.content}>
              <div className={styles.activity}>
                <ActivityCard activities={recentActivities} />
              </div>

              <div className={styles.quickActions}>
                <div className={styles.actionsCard}>
                  <h3>Ações Rápidas</h3>
                  <div className={styles.actions}>
                    <button
                      onClick={() => router.push("/admin/showcases")}
                      className={styles.actionBtn}
                    >
                      <span className={styles.actionIcon}>🎨</span>
                      <div>
                        <h4>Gerenciar Showcases</h4>
                        <p>Criar, editar ou deletar showcases</p>
                      </div>
                    </button>
                    {session?.user?.role === "ADMIN" && (
                      <button
                        onClick={() => router.push("/admin/users")}
                        className={styles.actionBtn}
                      >
                        <span className={styles.actionIcon}>👥</span>
                        <div>
                          <h4>Gerenciar Usuários</h4>
                          <p>Criar, editar ou deletar usuários</p>
                        </div>
                      </button>
                    )}
                    <button
                      onClick={() => router.push("/showcases")}
                      className={styles.actionBtn}
                    >
                      <span className={styles.actionIcon}>👁️</span>
                      <div>
                        <h4>Ver Site Público</h4>
                        <p>Visualizar o site como visitante</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
