import { useState } from "react";
import styles from "./contact.module.scss";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`${styles["section-contact"]} ${styles.section} themed-section`}
      data-bg="#F37F93"
      data-menu="#015958"
    >
      <div className={styles["section-content"]}>
        <h2 className={styles["section-header"]}>Contato</h2>
        <form className={styles["contact-form"]} onSubmit={handleSubmit}>
          <div className={styles["form-input-group"]}>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
            <label htmlFor="name">Nome</label>
          </div>

          <div className={styles["form-input-group"]}>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
          </div>

          <div
            className={`${styles["form-input-group"]} ${styles["textarea-group"]}`}
          >
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              value={form.message}
              onChange={handleChange}
            ></textarea>
            <label htmlFor="message">Mensagem</label>
          </div>

          <button
            type="submit"
            className={`${styles["submit-button"]} button`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
          {status === "success" && (
            // <p style={{ color: "green", marginTop: 10 }}>Mensagem enviada!</p>
            <p className={`${styles["success-message"]} ${styles["message"]}`}>
              Mensagem enviada!
            </p>
          )}
          {status === "error" && (
            <p className={`${styles["error-message"]} ${styles["message"]}`}>
              Erro ao enviar. Tente novamente.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
