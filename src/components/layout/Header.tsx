import { useState } from "react";
import { Link } from "react-router-dom";

// Nav tabs → routes. In the design these are 00 Index / 01 Projects / 02 Work /
// 03 Blog / 04 Contact. Projects/Work/Contact anchor-scroll on the home page;
// Blog is its own route.
const TABS: { label: string; to: string; hash?: string }[] = [
  { label: "Index", to: "/" },
  { label: "Projects", to: "/", hash: "#projects" },
  { label: "Work", to: "/", hash: "#work" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/", hash: "#contact" },
];

export default function Header({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="hdr grid g-1-2-1">
      <div className="hdr__brand">
        <Link to="/" className="hdr__wordmark">
          Gregory Feng
        </Link>
        <button
          className="hdr__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      <nav
        className={`hdr__tabs${open ? " hdr__tabs--open" : ""}`}
        aria-label="Primary"
      >
        {TABS.map((t) => {
          const isActive = t.label === active;
          const to = t.hash ? `${t.to}${t.hash}` : t.to;
          return (
            <Link
              key={t.label}
              to={to}
              className={`hdr__tab${isActive ? " hdr__tab--active" : ""}`}
              onClick={() => setOpen(false)}
              aria-current={isActive ? "page" : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="hdr__meta">Tempe, AZ</div>
    </header>
  );
}
