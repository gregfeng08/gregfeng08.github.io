import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { publishedPosts } from "../data/content";
import { BLOG_CATEGORIES } from "../data/resume";

function fmtDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

export default function Blog() {
  const [params, setParams] = useSearchParams();

  const activeCat = params.get("cat") || "All";
  const setCat = (c: string) =>
    setParams(c === "All" ? {} : { cat: c }, { replace: true });

  const visible = publishedPosts();

  const filtered = visible.filter(
    (p) => activeCat === "All" || p.category === activeCat,
  );
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const count = (c: string) =>
    c === "All"
      ? visible.length
      : visible.filter((p) => p.category === c).length;

  return (
    <div className="page">
      <Header active="Blog" />

      {/* Masthead + category rail */}
      <div className="grid g-1fr-side band">
        <div className="blog__masthead-main">
          <div className="kicker" style={{ marginBottom: 28 }}>
            № 03 · DEV BLOG · {visible.length} ENTRIES · 4 CATEGORIES
          </div>
          <h1 className="blog__title serif">
            Field
            <br />
            <span className="italic accent">notes.</span>
          </h1>
          <p className="blog__standfirst">
            Meshes, headsets, pipelines — written while the compile runs. No
            algorithm, no tracking, newest first.
          </p>
        </div>
        <div className="catrail">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`catrail__btn${activeCat === c ? " catrail__btn--active" : ""}`}
            >
              <span>
                {activeCat === c ? "→ " : ""}
                {c}
              </span>
              <span className="catrail__count">
                {String(count(c)).padStart(2, "0")}
              </span>
            </button>
          ))}
          <div className="catrail__rss">RSS ↗ · filed by hand</div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="state band">No entries in this category yet.</div>
      )}

      {/* Featured (newest of current filter) */}
      {featured && (
        <div className="grid g-meta band">
          <div className="feat__meta">
            Latest
            <br />
            <br />
            {featured.category}
          </div>
          <div className="feat__body editable">
            <h2 className="feat__title">{featured.title}</h2>
            <p className="feat__blurb">{featured.blurb}</p>
            <Link className="btn-read" to={`/blog/${featured.slug}`}>
              Read entry →
            </Link>
          </div>
          <div className="feat__date">
            {fmtDate(featured.date)}
            <br />
            {featured.readingTime} read
          </div>
        </div>
      )}

      {/* Remaining entries */}
      {rest.map((p, i) => (
        <div className="entry grid g-meta" key={p.id}>
          <div className="entry__meta">
            <div className="entry__cat">{p.category}</div>
            <div className="entry__num">{String(i + 2).padStart(2, "0")}</div>
          </div>
          <div className="entry__body editable">
            <Link
              to={`/blog/${p.slug}`}
              className="entry__title"
              style={{ color: "inherit", display: "block" }}
            >
              {p.title}
            </Link>
            <div className="entry__blurb">{p.blurb}</div>
          </div>
          <div className="entry__date">
            {fmtDate(p.date)}
            <br />
            {p.readingTime} read
          </div>
        </div>
      ))}

      <div className="blog__foot">
        <span>
          Showing {filtered.length} / {visible.length} · filter: {activeCat}
        </span>
        <span>— end of log · more soon —</span>
      </div>
    </div>
  );
}
