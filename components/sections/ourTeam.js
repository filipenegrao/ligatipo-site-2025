import Image from "next/image";
import styles from "./ourTeam.module.scss";
import teamImg from "@/assets/img/nossa-equipe-ligatipo.png";
import AccordionTriggerMinimal from "@/components/ui/accordion-trigger-minimal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Instagram from "../svgs/instagram";
import GithubIcon from "../svgs/github";
import LinkedInIcon from "../svgs/linkedin";
import { useRef } from "react";
import useParallaxImage from "../anim/useParallaxImage";

export default function OurTeam() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  useParallaxImage(sectionRef, bgRef, 10);

  return (
    <section
      ref={sectionRef}
      className={`${styles["section-our-team"]} ${styles.section} themed-section`}
      data-bg="#015958"
      data-menu="#F0EFDD"
    >
      <div className={styles["section-content"]}>
        <h2 className={styles["section-header"]}>Nosso Time</h2>
      </div>
      <div className={styles["team-names"]}>
        <div className={`${styles.left} ${styles.teamMember}`}>
          <Accordion
            type="single"
            collapsible
            className={`w-full ${styles["custom-accordion"]}`}
            defaultValue="none"
          >
            <AccordionItem value="item-1">
              <AccordionTriggerMinimal className={styles["team-name"]}>
                Filipe Negrão
              </AccordionTriggerMinimal>
              <AccordionContent className="flex flex-col gap-4 text-balance accordion-content-txt">
                <div className={styles.line}></div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  varius, ipsum nec maximus dapibus, tellus augue semper felis,
                  in porta enim elit id nisi. Aliquam ut nunc urna. Donec
                  consequat urna ut aliquam feugiat. Sed scelerisque lectus at
                  velit blandit cursus. Donec id metus massa. Morbi dui metus,
                  vehicula et dui eget, hendrerit feugiat orci. Duis turpis
                  massa, commodo eu risus a, rhoncus egestas dui. Sed
                  condimentum egestas auctor. Quisque ac tincidunt lorem, in
                  ullamcorper nunc.
                </p>
                <p>
                  Sed ac luctus orci, maximus viverra purus. Duis quis
                  consectetur augue. Nam diam est, consectetur sit amet nisi in,
                  pulvinar rutrum lorem. Pellentesque congue hendrerit massa, ut
                  viverra dui vehicula quis. Sed pretium sem vel rutrum
                  convallis. Integer volutpat varius orci, ut auctor purus
                  suscipit eu. Nulla efficitur faucibus leo, a semper metus
                  tristique ac.
                </p>
                <div className={styles["social-media"]}>
                  <a
                    href="https://www.instagram.com/filipenegrao/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/filipenegrao/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <GithubIcon />
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className={`${styles.right} ${styles.teamMember}`}>
          <Accordion
            type="single"
            collapsible
            className={`w-full ${styles["custom-accordion"]}`}
            defaultValue="none"
          >
            <AccordionItem value="item-1">
              <AccordionTriggerMinimal className={styles["team-name"]}>
                Deia Kulpas
              </AccordionTriggerMinimal>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className={styles.line}></div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  varius, ipsum nec maximus dapibus, tellus augue semper felis,
                  in porta enim elit id nisi. Aliquam ut nunc urna. Donec
                  consequat urna ut aliquam feugiat. Sed scelerisque lectus at
                  velit blandit cursus. Donec id metus massa. Morbi dui metus,
                  vehicula et dui eget, hendrerit feugiat orci. Duis turpis
                  massa, commodo eu risus a, rhoncus egestas dui. Sed
                  condimentum egestas auctor. Quisque ac tincidunt lorem, in
                  ullamcorper nunc.
                </p>
                <p>
                  Sed ac luctus orci, maximus viverra purus. Duis quis
                  consectetur augue. Nam diam est, consectetur sit amet nisi in,
                  pulvinar rutrum lorem. Pellentesque congue hendrerit massa, ut
                  viverra dui vehicula quis. Sed pretium sem vel rutrum
                  convallis. Integer volutpat varius orci, ut auctor purus
                  suscipit eu. Nulla efficitur faucibus leo, a semper metus
                  tristique ac.
                </p>
                <div className={styles["social-media"]}>
                  <a
                    href="https://www.instagram.com/filipenegrao/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/filipenegrao/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div ref={bgRef} className={styles["bg"]}>
        <Image
          src={teamImg}
          alt="Filipe e Deia"
          fill
          priority
          sizes="100vw"
          className={styles["bgImage"]}
        />
      </div>
    </section>
  );
}
