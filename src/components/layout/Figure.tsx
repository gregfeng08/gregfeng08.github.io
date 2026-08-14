import { useState } from "react";
import type { MediaItem } from "../../types";

// Framed figure. With more than one media item it becomes a small carousel:
// cycle with the dots along the bottom (or the arrows on hover). Videos get
// native controls. With no media it shows the hatch placeholder.
export default function Figure({
  caption,
  role,
  image,
  media,
  alt,
}: {
  caption: string;
  role?: string;
  image?: string;
  media?: MediaItem[];
  alt?: string;
}) {
  const items: MediaItem[] =
    media && media.length
      ? media
      : image
        ? [{ type: "image", src: image, alt }]
        : [];

  const [idx, setIdx] = useState(0);
  const has = items.length > 0;
  const multi = items.length > 1;
  const i = Math.min(idx, Math.max(items.length - 1, 0));
  const current = items[i];
  const go = (n: number) => setIdx((n + items.length) % items.length);

  return (
    <div className={`figure${has ? " figure--has-img" : ""}`}>
      {!has && <div className="figure__hatch" />}
      {has && current.type === "video" && (
        <video
          className="figure__img"
          src={current.src}
          poster={current.poster}
          controls
          playsInline
          preload="metadata"
        />
      )}
      {has && current.type === "image" && (
        <img
          className="figure__img"
          src={current.src}
          alt={current.alt || alt || role || caption}
        />
      )}

      <div className="figure__cap">{caption}</div>
      {role && <div className="figure__role">{role}</div>}

      {multi && (
        <>
          <button
            type="button"
            className="figure__nav figure__nav--prev"
            aria-label="Previous"
            onClick={() => go(i - 1)}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                d="M15 5 L8 12 L15 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="figure__nav figure__nav--next"
            aria-label="Next"
            onClick={() => go(i + 1)}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                d="M9 5 L16 12 L9 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="figure__dots">
            {items.map((_, n) => (
              <button
                type="button"
                key={n}
                className={`figure__dot${n === i ? " figure__dot--active" : ""}`}
                aria-label={`Show item ${n + 1} of ${items.length}`}
                aria-current={n === i}
                onClick={() => go(n)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
