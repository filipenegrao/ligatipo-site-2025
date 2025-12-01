"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./MediaCarousel.module.scss";
import * as HoverCard from "@radix-ui/react-hover-card";

export default function MediaCarousel({ items, title, projectInfo }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const openLightbox = useCallback((src, alt) => {
    setLightboxImage({ src, alt });
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxImage(null);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && lightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [lightboxOpen, closeLightbox]);

  return (
    <div className={styles.carousel_container}>
      {title && (
        <div className={styles.embla__title}>
          <h3>{title}</h3>
          <HoverCard.Root openDelay={100} closeDelay={150}>
            <HoverCard.Trigger asChild>
              <button
                className={styles.embla__info_icon}
                aria-label="Informações do projeto"
              >
                <svg
                  className={styles.info_icon}
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M81.344 138V71.056L96.832 69.136V138H81.344ZM89.28 58.128C83.776 58.128 79.552 54.8 79.552 48.4C79.552 42.128 83.776 38.8 89.28 38.8C94.656 38.8 99.008 42.128 99.008 48.4C99.008 54.8 94.656 58.128 89.28 58.128Z"
                    fill="#015959"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="83"
                    stroke="#015959"
                    strokeWidth="14"
                  />
                </svg>
              </button>
            </HoverCard.Trigger>
            <HoverCard.Content
              side="left"
              align="start"
              className={styles.infoHoverCard}
            >
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Título:</span>
                <span className={styles.infoValue}>
                  {projectInfo?.title ?? title}
                </span>
              </div>
              {projectInfo?.designer && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Projeto gráfico:</span>
                  <span className={styles.infoValue}>
                    {projectInfo.designer}
                  </span>
                </div>
              )}
              {projectInfo?.publishedAt && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Publicação:</span>
                  <span className={styles.infoValue}>
                    {projectInfo.publishedAt}
                  </span>
                </div>
              )}
              {(projectInfo?.contactUrl || projectInfo?.contactLabel) && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Contato:</span>
                  {projectInfo?.contactUrl ? (
                    <a
                      className={styles.infoLink}
                      href={projectInfo.contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {projectInfo?.contactLabel ?? projectInfo.contactUrl}
                    </a>
                  ) : (
                    <span className={styles.infoValue}>
                      {projectInfo?.contactLabel}
                    </span>
                  )}
                </div>
              )}
              <HoverCard.Arrow className={styles.infoArrow} />
            </HoverCard.Content>
          </HoverCard.Root>
        </div>
      )}
      <div className={styles.line}></div>
      <div className={styles.embla}>
        <div className={styles.embla__wrapper}>
          <button
            className={`${styles.embla__button} ${styles.embla__button_prev}`}
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={styles.embla__viewport} ref={emblaRef}>
            <div className={styles.embla__container}>
              {items.map((item, index) => (
                <div className={styles.embla__slide} key={index}>
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      controls
                      className={styles.embla__slide__media}
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt || `Slide ${index + 1}`}
                      className={styles.embla__slide__media}
                      onClick={() => openLightbox(item.src, item.alt)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles.embla__button} ${styles.embla__button_next}`}
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className={styles.embla__dots}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`${styles.embla__dot} ${
                index === selectedIndex ? styles["embla__dot--selected"] : ""
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {lightboxOpen && lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div
            className={styles.lightbox__content}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.lightbox__close}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt || "Full size image"}
              className={styles.lightbox__image}
            />
          </div>
        </div>
      )}
    </div>
  );
}
