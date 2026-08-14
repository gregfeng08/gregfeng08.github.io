import SectionHead from "../layout/SectionHead";
import Figure from "../layout/Figure";
import { projectMedia } from "../../data/projectMedia";
import type { Project } from "../../types";

// Selected projects (№ 03). Data-driven from the static content module
// (src/data/content.ts). Each project's figure media is auto-discovered from
// src/assets/projects/<id>/ (see src/data/projectMedia.ts).
export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <>
      <SectionHead
        num="03"
        title="Selected projects"
        note={`N=${projects.length} · full index in log`}
        id="projects"
      />
      {projects.length === 0 && (
        <div className="state band">No projects yet.</div>
      )}
      {projects.map((p, i) => {
        const media = projectMedia(p.id, p.media);
        const num = String(i + 1).padStart(2, "0");
        return (
          <div
            className={`proj grid g-proj${i === projects.length - 1 ? " band" : ""}`}
            key={p.id}
          >
            <div className="proj__index">
              <div className="proj__num">{num}</div>
              {p.when.split(/\s*[–—]\s*/).map((d, j) => (
                <div key={j}>{d.trim()}</div>
              ))}
            </div>
            <div className="proj__body">
              <h3 className="proj__title">{p.title}</h3>
              <p className="proj__blurb">{p.blurb}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Figure
              media={media}
              caption={`FIG. ${num}${media.length ? "" : " · [ DROP FILES HERE ]"}`}
              role={p.role}
              alt={p.title}
            />
          </div>
        );
      })}
    </>
  );
}
