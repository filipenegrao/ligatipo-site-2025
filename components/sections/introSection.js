import styles from "./intro.module.scss";
import LogoLigatipo from "../svgs/logo-ligatipo";

export default function Intro() {
  return (
    <section
      className={`${styles["section-intro"]} ${styles.section} themed-section intro-section`}
      data-bg="#015958"
      data-menu="#F0EFDD"
      data-line-span="0.5"
    >
      <div className={styles["section-content"]}>
        <h1>descubra, aprenda e inove com a gente.</h1>
        <div className={`${styles["middle-line"]} mid-line`}></div>
        <div className={styles["logo-container"]}>
          <LogoLigatipo />
        </div>
      </div>
    </section>
  );
}
