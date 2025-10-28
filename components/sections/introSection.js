import styles from "./intro.module.scss";
import LogoLigatipo from "../svgs/logo-ligatipo";

export default function Intro() {
  return (
    <section
      className={`${styles["section-intro"]} ${styles.section} themed-section`}
      data-bg="#015958"
      data-menu="#F0EFDD"
    >
      <div className={styles["section-content"]}>
        <h1>descubra, aprenda e inove com a gente.</h1>
        <div className={styles["middle-line"]}></div>
        <div className={styles["logo-container"]}>
          <LogoLigatipo />
        </div>
      </div>
    </section>
  );
}
