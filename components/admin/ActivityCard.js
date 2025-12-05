import styles from "./ActivityCard.module.scss";

export default function ActivityCard({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "showcase":
        return "🎨";
      case "user":
        return "👤";
      case "edit":
        return "✏️";
      case "delete":
        return "🗑️";
      default:
        return "📌";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora mesmo";
    if (diffMins < 60) return `há ${diffMins}min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    return `há ${diffDays}d`;
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Atividade Recente</h3>
      <div className={styles.activities}>
        {activities && activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div key={idx} className={styles.activity}>
              <span className={styles.icon}>
                {getActivityIcon(activity.type)}
              </span>
              <div className={styles.content}>
                <p className={styles.description}>{activity.description}</p>
                <span className={styles.time}>
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>Nenhuma atividade recente</p>
        )}
      </div>
    </div>
  );
}
