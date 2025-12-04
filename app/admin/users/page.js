"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/admin/PageHeader";
import UserCard from "@/components/admin/UserCard";
import styles from "./admin-users.module.scss";
import adminForms from "../_styles/forms.module.scss";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "CLIENT",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const token = await getBackendToken();
      const res = await fetch(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getBackendToken();
      if (!token) {
        throw new Error("Falha ao autenticar no backend.");
      }

      const url = editingId
        ? `${baseUrl}/users/${editingId}`
        : `${baseUrl}/users`;

      const method = editingId ? "PUT" : "POST";

      const payload = editingId
        ? {
            email: formData.email,
            name: formData.name,
            ...(formData.password && { password: formData.password }),
          }
        : formData;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let details = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            details = data.message || JSON.stringify(data);
          } else {
            details = await res.text();
          }
        } catch {}
        throw new Error(`Erro ao salvar usuário (${res.status}): ${details}`);
      }

      await fetchUsers();
      resetForm();
      alert(editingId ? "Usuário atualizado!" : "Usuário criado!");
    } catch (error) {
      console.error("Erro:", error);
      alert(error?.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      password: "",
      name: user.name || "",
      role: user.role || "CLIENT",
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    setLoading(true);
    try {
      const token = await getBackendToken();
      const res = await fetch(`${baseUrl}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      await fetchUsers();
      alert("Usuário deletado!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar usuário");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "CLIENT",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleNewUser = () => {
    if (showForm && !editingId) {
      resetForm();
    } else {
      resetForm();
      setShowForm(true);
    }
  };

  const getBackendToken = async () => {
    if (!session?.user?.email) return null;
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        password: "admin123",
      }),
    });

    if (!loginRes.ok) {
      try {
        const data = await loginRes.json();
        console.error("Login backend falhou:", data);
      } catch {}
      return null;
    }

    const loginData = await loginRes.json();
    return loginData.access_token;
  };

  if (status === "loading" || loading) {
    return <div className={`loading ${styles.loading}`}>Carregando...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Gerenciar Usuários"
        action={{
          label: showForm && !editingId ? "Cancelar" : "Novo Usuário",
          onClick: handleNewUser,
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className={adminForms.form}>
          <h2>{editingId ? "Editar Usuário" : "Novo Usuário"}</h2>

          <div className={adminForms.field}>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className={adminForms.field}>
            <label htmlFor="name">Nome *</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className={adminForms.field}>
            <label htmlFor="role">Tipo de Usuário *</label>
            <select
              id="role"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="CLIENT">Cliente</option>
              <option value="EMPLOYEE">Funcionário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {!editingId && (
            <div className={adminForms.field}>
              <label htmlFor="password">Senha *</label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          <div className={adminForms.formActions}>
            <button
              type="submit"
              className={adminForms.btnPrimary}
              disabled={loading}
            >
              {loading ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className={adminForms.btnSecondary}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        <h2>Usuários Existentes ({users.length})</h2>
        {users.length === 0 ? (
          <p className={styles.empty}>Nenhum usuário encontrado</p>
        ) : (
          <div className={styles.grid}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
