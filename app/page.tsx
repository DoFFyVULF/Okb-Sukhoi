import { Preloader } from "@/components/Preloader";
import { Reveal } from "@/components/Reveal";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { History } from "@/components/History";
import { Fleet } from "@/components/Fleet";
import { FlightScene } from "@/components/FlightScene";
import { Weapons } from "@/components/Weapons";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Reveal />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <History />
        <Fleet />
        <FlightScene />
        <Weapons />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
