"use client";

import React from "react";

class GSAPErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Captura apenas erros do tipo NotFoundError relacionados ao GSAP
    if (error?.message?.includes("can not be found here")) {
      console.warn("GSAP cleanup error caught and suppressed:", error);
      return { hasError: false }; // Não mostra erro para o usuário
    }
    // Outros erros são propagados
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (!error?.message?.includes("can not be found here")) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  render() {
    return this.props.children;
  }
}

export default GSAPErrorBoundary;
