"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MainHeader from "@/components/main-header";
import FixedFooter from "@/components/fixed-footer";
import HideUIOnScroll from "@/components/anim/HideUIOnScroll";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Se a rota mudou, limpa tudo do GSAP ANTES de qualquer renderização
    if (prevPathname.current !== pathname) {
      // Desabilita temporariamente o GSAP
      gsap.globalTimeline.pause();

      // Mata todos os ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Mata todas as animações ativas
      gsap.globalTimeline.clear();
      gsap.killTweensOf("*");

      // Reativa o GSAP após um pequeno delay
      setTimeout(() => {
        gsap.globalTimeline.resume();
      }, 100);

      prevPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      <HideUIOnScroll />
      <MainHeader />
      {children}
      <FixedFooter />
    </>
  );
}
