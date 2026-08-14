import { Link, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Header from "../components/layout/Header";
import { FEED } from "../data/content";
import type { Article, FeedEntry, Post } from "../types";

// The blog is one reverse-chron stream, partitioned by type. Short "posts"
// render inline; long "articles" show a card that links to their own page.

const PARTITIONS = [
  { key: "all", label: "Everything" },
  { key: "posts", label: "Posts" },
  { key: "articles", label: "Articles" },
] as const;

function fmtDate(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EntryHead({ entry }: { entry: FeedEntry }) {
  const isPost = entry.kind === "post";
  return (
    <div className="s-head">
      <span className={`s-kind s-kind--${entry.kind}`}>
        <span className="s-dot" />
        {isPost ? "Post" : "Article"}
      </span>
      <span className="s-topic">{entry.topic}</span>
      <span className="s-time">{fmtDate(entry.date)}</span>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="s-entry s-entry--post">
      <EntryHead entry={post} />
      <div className="s-post-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {post.body}
        </ReactMarkdown>
      </div>
      {post.image && (
        <img className="s-post-img" src={post.image} alt="" loading="lazy" />
      )}
    </article>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="s-entry s-entry--article">
      <EntryHead entry={article} />
      <Link to={`/blog/${article.slug}`} className="s-article-title">
        {article.title}
      </Link>
      <p className="s-article-blurb">{article.blurb}</p>
      <div className="s-article-foot">
        <Link className="btn-read" to={`/blog/${article.slug}`}>
          Read article →
        </Link>
        {article.readingTime && (
          <span className="s-readtime">{article.readingTime} read</span>
        )}
      </div>
    </article>
  );
}

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const active = params.get("type") || "all";

  const setPartition = (key: string) =>
    setParams(key === "all" ? {} : { type: key }, { replace: true });

  const filtered = FEED.filter((e) =>
    active === "all"
      ? true
      : active === "posts"
        ? e.kind === "post"
        : e.kind === "article",
  );

  const count = (key: string) =>
    key === "all"
      ? FEED.length
      : FEED.filter((e) => (key === "posts" ? e.kind === "post" : e.kind === "article"))
          .length;

  return (
    <div className="page">
      <Header active="Blog" />

      {/* Masthead + partition rail */}
      <div className="grid g-1fr-side band">
        <div className="blog__masthead-main">
          <div className="kicker" style={{ marginBottom: 24 }}>
            The blog · {FEED.length} entries
          </div>
          <h1 className="blog__title serif">
            Field
            <br />
            <span className="italic accent">notes.</span>
          </h1>
          <p className="blog__standfirst">
            Half short posts from whatever I&apos;m building this week, half
            longer write-ups when something earns the depth. Mostly graphics and
            XR. Newest first.
          </p>
        </div>
        <div className="catrail">
          {PARTITIONS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPartition(p.key)}
              className={`catrail__btn${active === p.key ? " catrail__btn--active" : ""}`}
            >
              <span>
                {active === p.key ? "→ " : ""}
                {p.label}
              </span>
              <span className="catrail__count">
                {String(count(p.key)).padStart(2, "0")}
              </span>
            </button>
          ))}
          <div className="catrail__note">Posts are inline. Articles open up.</div>
        </div>
      </div>

      {/* The stream */}
      <div className="stream">
        {filtered.length === 0 && (
          <div className="state">Nothing here yet. Check back soon.</div>
        )}
        {filtered.map((e) =>
          e.kind === "post" ? (
            <PostCard key={e.id} post={e} />
          ) : (
            <ArticleCard key={e.id} article={e} />
          ),
        )}
      </div>

      <div className="blog__foot">
        <span>
          Showing {filtered.length} / {FEED.length}
        </span>
        <span>more soon</span>
      </div>
    </div>
  );
}
