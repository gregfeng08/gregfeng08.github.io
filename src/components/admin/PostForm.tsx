import { useState } from "react";
import Modal from "./Modal";
import { postsApi } from "../../lib/api";
import { BLOG_CATEGORIES } from "../../data/resume";
import type { BlogPost, BlogCategory } from "../../types";

const CATS = BLOG_CATEGORIES.filter((c) => c !== "All") as BlogCategory[];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// Form-style interface to create/edit a blog post.
export default function PostForm({
  existing,
  onClose,
  onSaved,
}: {
  existing?: BlogPost;
  onClose: () => void;
  onSaved: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  const [category, setCategory] = useState<BlogCategory>(existing?.category ?? "Graphics");
  const [date, setDate] = useState(existing?.date ?? today);
  const [readingTime, setReadingTime] = useState(existing?.readingTime ?? "");
  const [blurb, setBlurb] = useState(existing?.blurb ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [published, setPublished] = useState(existing?.published ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const effectiveSlug = slug || slugify(title);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Estimate reading time from body if not provided (~200 wpm).
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    const auto = `${Math.max(1, Math.round(words / 200))} min`;
    const body_: Partial<BlogPost> = {
      title: title.trim(),
      slug: effectiveSlug,
      category,
      date,
      readingTime: readingTime.trim() || auto,
      blurb: blurb.trim(),
      body,
      featured,
      published,
    };
    try {
      if (existing) await postsApi.update(existing.id, body_);
      else await postsApi.create(body_);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    if (!confirm(`Delete post “${existing.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await postsApi.remove(existing.id);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  return (
    <Modal
      title={existing ? "Edit entry" : "New field note"}
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
            <button type="submit" form="post-form" className="btn btn--primary" disabled={busy}>
              {busy ? "Saving…" : existing ? "Save changes" : "Publish entry"}
            </button>
          </div>
        </>
      }
    >
      <form id="post-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <div className="field">
          <label className="field__label" htmlFor="b-title">Title</label>
          <input
            id="b-title"
            className="field__input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="b-slug">Slug (URL)</label>
          <input
            id="b-slug"
            className="field__input"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
            placeholder={slugify(title)}
          />
          <div className="field__hint">/blog/{effectiveSlug || "…"}</div>
        </div>
        <div className="field__row">
          <div className="field">
            <label className="field__label" htmlFor="b-cat">Category</label>
            <select id="b-cat" className="field__select" value={category} onChange={(e) => setCategory(e.target.value as BlogCategory)}>
              {CATS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="b-date">Date</label>
            <input id="b-date" className="field__input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="b-blurb">Blurb (list preview)</label>
          <textarea id="b-blurb" className="field__textarea" value={blurb} onChange={(e) => setBlurb(e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="b-body">Body (Markdown)</label>
          <textarea id="b-body" className="field__textarea field__textarea--body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="## Section&#10;&#10;Write in Markdown. Code blocks, lists, links, images all work." />
          <div className="field__hint">Markdown · GFM. Reading time auto-estimates if left blank.</div>
        </div>
        <div className="field__row">
          <div className="field">
            <label className="field__label" htmlFor="b-read">Reading time (optional)</label>
            <input id="b-read" className="field__input" value={readingTime} onChange={(e) => setReadingTime(e.target.value)} placeholder="auto" />
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", paddingBottom: 10 }}>
            <div className="field field--check">
              <input id="b-feat" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <label className="field__label" htmlFor="b-feat">Featured</label>
            </div>
            <div className="field field--check">
              <input id="b-pub" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <label className="field__label" htmlFor="b-pub">Published</label>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
