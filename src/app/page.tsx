import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Branches from "@/components/Branches";
import SocialFeed from "@/components/SocialFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Branches />
        <SocialFeed />
        <Contact />
      </main>
      <Footer />
      <Script
        src="https://digita3-ai.vercel.app/widget.js"
        data-agent="barberia-carlyn"
        strategy="afterInteractive"
      />
    </>
  );
}
