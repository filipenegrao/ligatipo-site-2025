import styles from "./PageHeader.module.scss";

export default function PageHeader({ title, action }) {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      {action && (
        <button
          onClick={action.onClick}
          className={`button ${styles.btnAction}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
