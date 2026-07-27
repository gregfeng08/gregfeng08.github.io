import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/layout/Header";
import PostForm from "../components/admin/PostForm";
import { postsApi } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useContent } from "../lib/content";
import type { BlogPost as Post } from "../types";

function fmtDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function BlogPost() {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  const { posts, refreshPosts } = useContent();
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fromList = posts.find((p) => p.slug === slug);
    if (fromList) {
      setPost(fromList);
      setStatus("ready");
      return;
    }
    // Fall back to a direct fetch (e.g. deep link before list loaded).
    postsApi
      .get(slug!)
      .then((p) => {
        if (cancelled) return;
        setPost(p);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("notfound"));
    return () => {
      cancelled = true;
    };
  }, [slug, posts]);

  useEffect(() => window.scrollTo(0, 0), [slug]);

  return (
    <div className="page">
      <Header active="Blog" />

      {status === "loading" && <div className="state">Loading…</div>}

      {status === "notfound" && (
        <div className="state band">
          Entry not found. <Link to="/blog">← Back to field notes</Link>
        </div>
      )}

      {status === "ready" && post && (
        <div className="grid g-meta band">
          <div className="post__rail">
            <div className="post__rail-cat">{post.category}</div>
            <div className="post__rail-row">{fmtDate(post.date)}</div>
            <div className="post__rail-row">{post.readingTime} read</div>
            {isAdmin && (
              <button
                className="btn"
                style={{ marginTop: 20 }}
                onClick={() => setEditing(true)}
              >
                ✎ Edit
              </button>
            )}
          </div>
          <div className="post__main">
            <h1 className="post__title">{post.title}</h1>
            <div className="post__prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
            </div>
            <Link to="/blog" className="post__back">
              ← Back to field notes
            </Link>
          </div>
          <div className="post__aside">№ · Field note</div>
        </div>
      )}

      {editing && post && (
        <PostForm
          existing={post}
          onClose={() => setEditing(false)}
          onSaved={async () => {
            await refreshPosts();
            const updated = await postsApi.get(post.slug).catch(() => null);
            if (updated) setPost(updated);
          }}
        />
      )}
    </div>
  );
}
