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
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
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
        <div className={styles["section-wrapper"]}>
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
              className={`${styles["submit-button"]} button ${
                status === "success"
                  ? styles["success-state"]
                  : status === "error"
                  ? styles["error-state"]
                  : ""
              }`}
              disabled={loading || status !== null}
            >
              {status === "success"
                ? "Mensagem enviada!"
                : status === "error"
                ? "Erro ao enviar!"
                : loading
                ? "Enviando..."
                : "Enviar"}
            </button>
          </form>
          {/* <div className={styles["social-media"]}>
            <ul className={styles["social-media-list"]}>
              <li>
                <a
                  href="https://www.instagram.com/ligatipo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IN
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/ligatipo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LI
                </a>
              </li>
              <li>
                <a
                  href="https://ligatipo.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SB
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </section>
  );
}
