import styles from "./StatCard.module.scss";

export default function StatCard({ title, value, icon, trend, trendValue }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${styles[trend]}`}>
          <span className={styles.arrow}>{trend === "up" ? "↑" : "↓"}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
