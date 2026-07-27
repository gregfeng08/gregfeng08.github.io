import { useState } from "react";
import Modal from "./Modal";
import { projectsApi } from "../../lib/api";
import type { Project } from "../../types";

// Create/edit a project. `existing` present ⇒ edit mode (with delete).
export default function ProjectForm({
  existing,
  onClose,
  onSaved,
}: {
  existing?: Project;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [role, setRole] = useState(existing?.role ?? "");
  const [when, setWhen] = useState(existing?.when ?? "");
  const [short, setShort] = useState(existing?.short ?? "");
  const [blurb, setBlurb] = useState(existing?.blurb ?? "");
  const [tags, setTags] = useState(existing?.tags?.join(", ") ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [order, setOrder] = useState(String(existing?.order ?? ""));
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body: Partial<Project> = {
      title: title.trim(),
      role: role.trim(),
      when: when.trim(),
      short: short.trim(),
      blurb: blurb.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: image.trim() || undefined,
      featured,
      order: order === "" ? undefined : Number(order),
    };
    try {
      if (existing) await projectsApi.update(existing.id, body);
      else await projectsApi.create(body);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    if (!confirm(`Delete project “${existing.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await projectsApi.remove(existing.id);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  return (
    <Modal
      title={existing ? "Edit project" : "New project"}
      onClose={onClose}
      footer={
        <>
          <div>
            {existing && (
              <button type="button" className="btn btn--danger" onClick={remove} disabled={busy}>
                Delete
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" form="project-form" className="btn btn--primary" disabled={busy}>
              {busy ? "Saving…" : existing ? "Save changes" : "Create project"}
            </button>
          </div>
        </>
      }
    >
      <form id="project-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <div className="field">
          <label className="field__label" htmlFor="p-title">Title</label>
          <input id="p-title" className="field__input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field__row">
          <div className="field">
            <label className="field__label" htmlFor="p-when">When</label>
            <input id="p-when" className="field__input" value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Nov 2025 — Present" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="p-role">Role</label>
            <input id="p-role" className="field__input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Lead engineer · Celano Lab" />
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="p-short">Short (one line)</label>
          <input id="p-short" className="field__input" value={short} onChange={(e) => setShort(e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="p-blurb">Blurb</label>
          <textarea id="p-blurb" className="field__textarea" value={blurb} onChange={(e) => setBlurb(e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="p-tags">Tags (comma-separated)</label>
          <input id="p-tags" className="field__input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Unity 6, C#, Cloud Run" />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="p-image">Image URL (optional)</label>
          <input id="p-image" className="field__input" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…  or  /uploads/shot.jpg" />
          <div className="field__hint">Real screenshot / Quest capture. Leave blank for the FIG placeholder.</div>
        </div>
        <div className="field__row">
          <div className="field">
            <label className="field__label" htmlFor="p-order">Order (optional)</label>
            <input id="p-order" className="field__input" type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="0 = top" />
          </div>
          <div className="field field--check" style={{ alignItems: "flex-end", paddingBottom: 10 }}>
            <input id="p-feat" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <label className="field__label" htmlFor="p-feat">Featured</label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
