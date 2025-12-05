import styles from "./UserCard.module.scss";
import BaseCardStyles from "./BaseCard.module.scss";
import BaseCard from "./BaseCard";

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

export default function UserCard({ user, onEdit, onDelete, userRole }) {
  const actions = [];

  if (userRole === "ADMIN") {
    actions.push(
      {
        label: "Editar",
        onClick: () => onEdit(user),
        className: BaseCardStyles.btnEdit,
      },
      {
        label: "Deletar",
        onClick: () => onDelete(user.id),
        className: BaseCardStyles.btnDelete,
      }
    );
  }

  return (
    <BaseCard className={styles.card} actions={actions}>
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
    </BaseCard>
  );
}
