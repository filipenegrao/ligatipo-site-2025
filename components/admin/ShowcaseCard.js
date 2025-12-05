import styles from "./ShowcaseCard.module.scss";
import BaseCardStyles from "./BaseCard.module.scss";
import BaseCard from "./BaseCard";

export default function ShowcaseCard({ showcase, onEdit, onDelete, userRole }) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "";

  const getPreviewSrc = () => {
    const firstItem = Array.isArray(showcase.items)
      ? showcase.items.find((it) => it?.type !== "video") || showcase.items[0]
      : null;
    if (!firstItem || !firstItem.src) return null;
    const src = firstItem.src;
    if (src.startsWith("/uploads/")) {
      return base ? `${base}${src}` : src;
    }
    return src;
  };

  const previewSrc = getPreviewSrc();

  const actions = [
    {
      label: "Editar",
      onClick: () => onEdit(showcase),
      className: BaseCardStyles.btnEdit,
    },
  ];

  if (userRole === "ADMIN") {
    actions.push({
      label: "Deletar",
      onClick: () => onDelete(showcase.id),
      className: BaseCardStyles.btnDelete,
    });
  }

  return (
    <BaseCard className={styles.card} actions={actions}>
      {previewSrc && (
        <div className={styles.previewWrapper}>
          <img
            src={previewSrc}
            alt={showcase.title || "preview"}
            className={styles.previewImage}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.info}>
        <h3>{showcase.title}</h3>
        {showcase.designer && (
          <p className={styles.designer}>por {showcase.designer}</p>
        )}
        {showcase.publishedAt && (
          <p className={styles.date}>{showcase.publishedAt}</p>
        )}
      </div>
    </BaseCard>
  );
}
