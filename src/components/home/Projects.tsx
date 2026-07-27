import SectionHead from "../layout/SectionHead";
import Figure from "../layout/Figure";
import type { Project } from "../../types";

// Selected projects (№ 03). Data-driven: `projects` comes from the API so the
// admin can add/edit/reorder them live. When `isAdmin`, each row gets an
// "edit" pill and an "+ add" affordance is handled by the floating action menu.
export default function Projects({
  projects,
  loading,
  isAdmin,
  onEdit,
}: {
  projects: Project[];
  loading: boolean;
  isAdmin: boolean;
  onEdit: (p: Project) => void;
}) {
  return (
    <>
      <SectionHead
        num="03"
        title="Selected projects"
        note={loading ? "Loading…" : `N=${projects.length} · full index in log`}
        id="projects"
      />
      {loading && <div className="state">Loading projects…</div>}
      {!loading && projects.length === 0 && (
        <div className="state band">No projects yet.</div>
      )}
      {projects.map((p, i) => (
        <div
          className={`proj grid g-proj${i === projects.length - 1 ? " band" : ""}`}
          key={p.id}
        >
          <div className="proj__index">
            <div className="proj__num">{String(i + 1).padStart(2, "0")}</div>
            {p.when.split("—").map((d, j) => (
              <div key={j}>{d.trim()}</div>
            ))}
          </div>
          <div className="proj__body">
            {isAdmin && (
              <button
                className="edit-pill"
                onClick={() => onEdit(p)}
                aria-label={`Edit ${p.title}`}
              >
                ✎ Edit
              </button>
            )}
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
            image={p.image}
            caption={`FIG. ${String(i + 1).padStart(2, "0")} — ${
              p.image ? "STILL" : "[ STILL · DROP HERE ]"
            }`}
            role={p.role}
            alt={p.title}
          />
        </div>
      ))}
    </>
  );
}
