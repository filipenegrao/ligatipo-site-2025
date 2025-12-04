import styles from "./ShowcaseCard.module.scss";

export default function ShowcaseCard({ showcase, onEdit, onDelete }) {
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

  return (
    <div className={styles.card}>
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
      <h3>{showcase.title}</h3>
      {showcase.designer && (
        <p className={styles.designer}>por {showcase.designer}</p>
      )}
      {showcase.publishedAt && (
        <p className={styles.date}>{showcase.publishedAt}</p>
      )}
      <div className={styles.actions}>
        <button
          onClick={() => onEdit(showcase)}
          className={`button ${styles.btnEdit}`}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(showcase.id)}
          className={`button ${styles.btnDelete}`}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
