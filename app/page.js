"use client";
import ScrollEffects from "@/components/anim/ScrollEffects";
import LineScaleEffect from "@/components/anim/LineScaleEffect";
import IntroSection from "@/components/sections/introSection";
import WhatWeDo from "@/components/sections/whatWeDo";
import OurTeam from "@/components/sections/ourTeam";
import Fonts from "@/components/sections/fonts";
import Contact from "@/components/sections/contact";

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
      <ScrollEffects />
      <LineScaleEffect />
      <IntroSection />
      <OurTeam />
      <WhatWeDo />
      <Fonts />
      <Contact />
    </>
  );
}
