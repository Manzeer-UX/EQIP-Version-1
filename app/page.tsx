import { EstateCanvas } from "@/components/EstateCanvas";
import { Nav } from "@/components/Nav";
import { PageEffects } from "@/components/PageEffects";
import {
  About,
  Capabilities,
  Closing,
  Evidence,
  Field,
  Footer,
  Hero,
  Loader,
  Marquee,
  Problem,
  WhatWeSee,
  WhereItMatters,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Loader />
      <EstateCanvas />
      <div className="vignette" aria-hidden="true" />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Problem />
        <WhatWeSee />
        <Capabilities />
        <WhereItMatters />
        <Evidence />
        <About />
        <Field />
        <Closing />
      </main>
      <Footer />
      <PageEffects />
    </>
  );
}
