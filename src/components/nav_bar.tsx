import { useState } from "react";
import "./nav_bar.css";

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Hamburger (mobile) */}
        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Links */}
        <nav id="primary-nav" className={`nav__links`} aria-label="Primary">
          <a className="nav__link" href="/projects">
            Projects
          </a>
          <a className="nav__link" href="/about">
            About
          </a>
          <a className="nav__link" href="/resume">
            Resume
          </a>
          <a className="nav__link" href="/contact">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
