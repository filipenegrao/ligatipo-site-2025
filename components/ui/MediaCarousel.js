"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./MediaCarousel.module.scss";

export default function MediaCarousel({ items, title }) {
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
