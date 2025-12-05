import styles from "./BaseCard.module.scss";

export default function BaseCard({ children, actions, className }) {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.content}>{children}</div>
      {actions && actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`button ${action.className || ""}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
