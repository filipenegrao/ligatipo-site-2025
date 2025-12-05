"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ShowcaseCard from "@/components/admin/ShowcaseCard";
import styles from "./admin-showcases.module.scss";
import adminForms from "../_styles/forms.module.scss";

export default function AdminShowcasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    designer: "",
    publishedAt: "",
    contactUrl: "",
    contactLabel: "",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role && userRole !== session.user.role) {
        setUserRole(session.user.role);
      }
      fetchShowcases();
    }
  }, [status]);

  const fetchShowcases = async () => {
    try {
      const res = await fetch(`${baseUrl}/showcases`);
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [];
      // Ensure items are available by fetching detail per id when missing
      const withItems = await Promise.all(
        list.map(async (sc) => {
          if (Array.isArray(sc.items) && sc.items.length > 0) return sc;
          try {
            const detailRes = await fetch(
              `${baseUrl}/showcases/${encodeURIComponent(sc.id)}`
            );
            if (!detailRes.ok) return sc;
            const detail = await detailRes.json();
            return {
              ...sc,
              items: Array.isArray(detail.items) ? detail.items : [],
            };
          } catch {
            return sc;
          }
        })
      );
      setShowcases(withItems);
    } catch (error) {
      console.error("Erro ao carregar showcases:", error);
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
        throw new Error(
          "Falha ao autenticar no backend. Verifique suas credenciais."
        );
      }

      // 1. Upload files first if there are new files
      let mediaItems = [...uploadedMedia];
      if (mediaFiles.length > 0) {
        const uploadedUrls = await uploadFiles(token);
        mediaItems = [...mediaItems, ...uploadedUrls];
      }

      // 2. Create showcase with media items
      const url = editingId
        ? `${baseUrl}/showcases/${editingId}`
        : `${baseUrl}/showcases`;

      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData,
        items: mediaItems.map((media, index) => ({
          type: media.type,
          src: media.url,
          alt: media.alt || formData.title,
          order: index,
        })),
      };

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
        throw new Error(
          `Erro ao salvar showcase (${res.status}): ${details || ""}`
        );
      }

      await fetchShowcases();
      resetForm();
      alert(editingId ? "Showcase atualizado!" : "Showcase criado!");
    } catch (error) {
      console.error("Erro:", error);
      alert(error?.message || "Erro ao salvar showcase");
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (token) => {
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      mediaFiles.forEach((file) => {
        formDataUpload.append("files", file.file);
      });

      const res = await fetch(`${baseUrl}/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Erro ao fazer upload");

      const data = await res.json();
      return data.files.map((file) => ({
        url: file.url,
        type: file.mimetype.startsWith("video/") ? "video" : "image",
        alt: file.originalName,
      }));
    } finally {
      setUploading(false);
    }
  };

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]; // MOV

  const validateFile = (file) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return `Tipo não suportado: ${file.type || file.name}`;
    }
    if (file.size > MAX_SIZE) {
      return `Arquivo muito grande: ${(file.size / (1024 * 1024)).toFixed(
        1
      )}MB (máx 50MB)`;
    }
    if (isImage && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return `Imagem não suportada (${file.type}). Use JPG, PNG, GIF ou WebP.`;
    }
    if (isVideo && !ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return `Vídeo não suportado (${file.type}). Use MP4, WebM ou MOV.`;
    }
    return "";
  };

  const handleFileChange = (e) => {
    setFileErrors([]);
    const files = Array.from(e.target.files);
    const newMedia = [];
    const errors = [];
    for (const file of files) {
      const err = validateFile(file);
      if (err) {
        errors.push({ name: file.name, error: err });
        continue;
      }
      newMedia.push({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }
    if (errors.length) setFileErrors(errors);
    if (newMedia.length) setMediaFiles([...mediaFiles, ...newMedia]);
  };

  const addFiles = (files) => {
    setFileErrors([]);
    const newMedia = [];
    const errors = [];
    for (const file of Array.from(files)) {
      const err = validateFile(file);
      if (err) {
        errors.push({ name: file.name, error: err });
        continue;
      }
      newMedia.push({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }
    if (errors.length) setFileErrors(errors);
    if (newMedia.length) setMediaFiles((prev) => [...prev, ...newMedia]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeMediaFile = (index) => {
    const newFiles = [...mediaFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
  };

  const moveMedia = (index, direction) => {
    const newFiles = [...mediaFiles];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newFiles.length) return;
    [newFiles[index], newFiles[newIndex]] = [
      newFiles[newIndex],
      newFiles[index],
    ];
    setMediaFiles(newFiles);
  };

  const handleEdit = (showcase) => {
    setFormData({
      title: showcase.title,
      designer: showcase.designer || "",
      publishedAt: showcase.publishedAt || "",
      contactUrl: showcase.contactUrl || "",
      contactLabel: showcase.contactLabel || "",
    });
    setEditingId(showcase.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este showcase?")) return;

    setLoading(true);
    try {
      const token = await getBackendToken();
      const res = await fetch(`${baseUrl}/showcases/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      await fetchShowcases();
      alert("Showcase deletado!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar showcase");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      designer: "",
      publishedAt: "",
      contactUrl: "",
      contactLabel: "",
    });
    setEditingId(null);
    setShowForm(false);
    mediaFiles.forEach((media) => URL.revokeObjectURL(media.preview));
    setMediaFiles([]);
    setUploadedMedia([]);
  };

  // Função helper para obter token do backend via login
  const getBackendToken = async () => {
    if (!session?.user?.email) return null;
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        password: "admin123", // TODO: Melhorar isso com token persistente
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

  const handleNewShowcase = () => {
    if (showForm && !editingId) {
      // Already on new form, just close
      resetForm();
    } else {
      // Open new form (reset any editing state)
      resetForm();
      setShowForm(true);
    }
  };

  return (
    <div>
      <PageHeader
        title="Gerenciar Showcases"
        action={{
          label: showForm && !editingId ? "Cancelar" : "Novo Showcase",
          onClick: handleNewShowcase,
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className={adminForms.form}>
          <h2>{editingId ? "Editar Showcase" : "Novo Showcase"}</h2>

          <div className={adminForms.field}>
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className={adminForms.field}>
            <label htmlFor="designer">Designer</label>
            <input
              id="designer"
              type="text"
              value={formData.designer}
              onChange={(e) =>
                setFormData({ ...formData, designer: e.target.value })
              }
            />
          </div>

          <div className={adminForms.field}>
            <label htmlFor="publishedAt">Data de Publicação</label>
            <input
              id="publishedAt"
              type="text"
              placeholder="Ex: Dez 2025"
              value={formData.publishedAt}
              onChange={(e) =>
                setFormData({ ...formData, publishedAt: e.target.value })
              }
            />
          </div>

          <div className={adminForms.field}>
            <label htmlFor="contactUrl">URL de Contato</label>
            <input
              id="contactUrl"
              type="url"
              placeholder="https://..."
              value={formData.contactUrl}
              onChange={(e) =>
                setFormData({ ...formData, contactUrl: e.target.value })
              }
            />
          </div>

          <div className={adminForms.field}>
            <label htmlFor="contactLabel">Label do Contato</label>
            <input
              id="contactLabel"
              type="text"
              placeholder="Ex: Instagram, LinkedIn"
              value={formData.contactLabel}
              onChange={(e) =>
                setFormData({ ...formData, contactLabel: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mediaFiles">Imagens e Vídeos</label>
            <div
              className={`${styles.dropArea} ${
                isDragging ? styles.dragging : ""
              }`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropContent}>
                <p>Arraste arquivos aqui ou clique para selecionar</p>
                <p className={styles.small}>
                  JPG, PNG, GIF, WebP, MP4, WebM, MOV (máx 50MB)
                </p>
                {fileErrors.length > 0 && (
                  <div className={adminForms.error}>
                    {fileErrors.map((err, idx) => (
                      <div key={idx}>
                        <strong>{err.name}:</strong> {err.error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="mediaFiles"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
            </div>
          </div>

          {mediaFiles.length > 0 && (
            <div className={styles.mediaPreview}>
              <h3>Mídias ({mediaFiles.length})</h3>
              <div className={styles.mediaGrid}>
                {mediaFiles.map((media, index) => (
                  <div key={index} className={styles.mediaItem}>
                    {media.type === "video" ? (
                      <video src={media.preview} className={styles.preview} />
                    ) : (
                      <img
                        src={media.preview}
                        alt=""
                        className={styles.preview}
                      />
                    )}
                    <div className={styles.mediaActions}>
                      <button
                        type="button"
                        onClick={() => moveMedia(index, -1)}
                        disabled={index === 0}
                        className={styles.btnIcon}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMedia(index, 1)}
                        disabled={index === mediaFiles.length - 1}
                        className={styles.btnIcon}
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className={styles.btnRemove}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={adminForms.formActions}>
            <button
              type="submit"
              className={adminForms.btnPrimary}
              disabled={loading || uploading}
            >
              {uploading
                ? "Fazendo upload..."
                : loading
                ? "Salvando..."
                : "Salvar"}
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
        <h2>Showcases Existentes ({showcases.length})</h2>
        {showcases.length === 0 ? (
          <p className={styles.empty}>Nenhum showcase encontrado</p>
        ) : (
          <div className={styles.grid}>
            {showcases.map((showcase) => (
              <ShowcaseCard
                key={showcase.id}
                showcase={showcase}
                userRole={userRole}
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
