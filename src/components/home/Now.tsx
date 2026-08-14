import { Link } from "react-router-dom";
import SectionHead from "../layout/SectionHead";
import { FEED } from "../../data/content";
import type { FeedEntry } from "../../types";

function fmtDate(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// One-line preview: article title, or the first bit of a post's body with the
// markdown stripped out.
function preview(entry: FeedEntry): string {
  if (entry.kind === "article") return entry.title;
  const text = entry.body
    .replace(/[*_`>#[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 116 ? text.slice(0, 115).trimEnd() + "…" : text;
}

export default function Now() {
  const latest = FEED.slice(0, 3);
  return (
    <>
      <SectionHead num="02" title="Now" note="Latest from the blog" />
      {latest.length === 0 ? (
        <div className="state band">Nothing on the blog yet. Soon.</div>
      ) : (
        <div className="grid g-3 band divide-r">
          {latest.map((e) => (
            <Link
              className="now__cell"
              key={e.id}
              to={e.kind === "article" ? `/blog/${e.slug}` : "/blog"}
            >
              <div className="now__label">
                {e.kind === "article" ? "Article" : "Post"} · {fmtDate(e.date)}
              </div>
              <div className="now__line">{preview(e)}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
