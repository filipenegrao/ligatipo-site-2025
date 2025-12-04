import styles from "./UserCard.module.scss";

const roleLabels = {
  ADMIN: "Administrador",
  EMPLOYEE: "Funcionário",
  CLIENT: "Cliente",
};

const roleBadgeClass = {
  ADMIN: styles.badgeAdmin,
  EMPLOYEE: styles.badgeEmployee,
  CLIENT: styles.badgeClient,
};

export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {(user.name || user.email).charAt(0).toUpperCase()}
      </div>
      <h3>{user.name || "Sem nome"}</h3>
      <p className={styles.email}>{user.email}</p>
      {user.role && (
        <span className={`${styles.badge} ${roleBadgeClass[user.role] || ""}`}>
          {roleLabels[user.role] || user.role}
        </span>
      )}
      {user.createdAt && (
        <p className={styles.date}>
          Criado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
        </p>
      )}
      <div className={styles.actions}>
        <button
          onClick={() => onEdit(user)}
          className={`button ${styles.btnEdit}`}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className={`button ${styles.btnDelete}`}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
