import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Header from "../components/layout/Header";
import { articleBySlug } from "../data/content";

function fmtDate(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function BlogPost() {
  const { slug } = useParams();
  const article = articleBySlug(slug);

  useEffect(() => window.scrollTo(0, 0), [slug]);

  return (
    <div className="page">
      <Header active="Blog" />

      {!article && (
        <div className="state band">
          Article not found. <Link to="/blog">← Back to the blog</Link>
        </div>
      )}

      {article && (
        <div className="grid g-meta band">
          <div className="post__rail">
            <div className="post__rail-cat">{article.topic}</div>
            <div className="post__rail-row">{fmtDate(article.date)}</div>
            {article.readingTime && (
              <div className="post__rail-row">{article.readingTime} read</div>
            )}
          </div>
          <div className="post__main">
            <h1 className="post__title">{article.title}</h1>
            <div className="post__prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {article.body}
              </ReactMarkdown>
            </div>
            <Link to="/blog" className="post__back">
              ← Back to the blog
            </Link>
          </div>
          <div className="post__aside">Article</div>
        </div>
      )}
    </div>
  );
}
