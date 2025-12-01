"use client";

import { useEffect } from "react";

export default function ErrorSuppressor() {
  useEffect(() => {
    // Suprime erros específicos do GSAP durante navegação
    const originalError = window.console.error;
    window.console.error = (...args) => {
      const errorMessage = args[0]?.message || args[0] || "";
      if (
        typeof errorMessage === "string" &&
        errorMessage.includes("can not be found here")
      ) {
        // Suprime o erro do GSAP
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      window.console.error = originalError;
    };
  }, []);

  return null;
}
