"use client";
import ThemeScrollController from "@/components/anim/ThemeScrollController";
import HideUIOnScroll from "@/components/anim/HideUIOnScroll";

import MainHeader from "@/components/main-header";
import FixedFooter from "@/components/fixed-footer";
import IntroSection from "@/components/sections/introSection";
import WhatWeDo from "@/components/sections/whatWeDo";
import OurTeam from "@/components/sections/ourTeam";
import Fonts from "@/components/sections/fonts";

export default function Home() {
  return (
    <>
      <div
        id="bg-layer"
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#015958",
          transition: "background-color 0.8s ease",
        }}
      />
      <ThemeScrollController
        sectionSelector=".themed-section"
        bgLayerSelector="#bg-layer"
        menuSelector=".site-menu"
      />
      <HideUIOnScroll />
      <MainHeader />
      <FixedFooter />
      <IntroSection />
      <OurTeam />
      <WhatWeDo />
      <Fonts />
    </>
  );
}
