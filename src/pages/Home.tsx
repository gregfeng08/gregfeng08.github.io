import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Now from "../components/home/Now";
import Projects from "../components/home/Projects";
import Work from "../components/home/Work";
import Education from "../components/home/Education";
import Skills from "../components/home/Skills";
import { sortedProjects } from "../data/content";

export default function Home() {
  const { hash } = useLocation();

  // Anchor-scroll when arriving with a hash (#projects, #work, #contact).
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div className="page">
      <Header active="Index" />
      <Hero />
      <About />
      <Now />
      <Projects projects={sortedProjects()} />
      <Work />
      <Education />
      <Skills />
      <Footer />
    </div>
  );
}
