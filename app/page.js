import MainHeader from "@/components/main-header";
import FixedFooter from "@/components/fixed-footer";
import IntroSection from "@/components/sections/introSection";
import WhatWeDo from "@/components/sections/whatWeDo";
import OurTeam from "@/components/sections/ourTeam";
import Fonts from "@/components/sections/fonts";

export default function Home() {
  return (
    <>
      <MainHeader />
      <FixedFooter />
      <IntroSection />
      <OurTeam />
      <WhatWeDo />
      <Fonts />
    </>
  );
}
