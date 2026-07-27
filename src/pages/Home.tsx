import { useEffect, useState } from "react";
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
import ProjectForm from "../components/admin/ProjectForm";
import { useAuth } from "../lib/auth";
import { useContent } from "../lib/content";
import type { Project } from "../types";

export default function Home() {
  const { isAdmin } = useAuth();
  const { projects, projectsLoading, refreshProjects } = useContent();
  const [editing, setEditing] = useState<Project | null>(null);
  const { hash } = useLocation();

  // Anchor-scroll when arriving with a hash (#projects, #work, #contact).
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, projectsLoading]);

  return (
    <div className="page">
      <Header active="Index" />
      <Hero />
      <About />
      <Now />
      <Projects
        projects={projects}
        loading={projectsLoading}
        isAdmin={isAdmin}
        onEdit={(p) => setEditing(p)}
      />
      <Work />
      <Education />
      <Skills />
      <Footer />

      {editing && (
        <ProjectForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={refreshProjects}
        />
      )}
    </div>
  );
}
