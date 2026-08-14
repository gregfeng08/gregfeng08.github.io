import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/layout/Header";
import { publishedPosts } from "../data/content";

function fmtDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = publishedPosts().find((p) => p.slug === slug) ?? null;

  useEffect(() => window.scrollTo(0, 0), [slug]);

  return (
    <div className="page">
      <Header active="Blog" />

      {!post && (
        <div className="state band">
          Entry not found. <Link to="/blog">← Back to field notes</Link>
        </div>
      )}

      {post && (
        <div className="grid g-meta band">
          <div className="post__rail">
            <div className="post__rail-cat">{post.category}</div>
            <div className="post__rail-row">{fmtDate(post.date)}</div>
            <div className="post__rail-row">{post.readingTime} read</div>
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
    </div>
  );
}
