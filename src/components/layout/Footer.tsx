import { CONTACT } from "../../data/resume";

// Inverted contact footer (№ 07) + colophon strip.
export default function Footer({ num = "07" }: { num?: string }) {
  return (
    <>
      <div className="footer" id="contact">
        <div className="footer__main">
          <div className="footer__kicker">№ {num} · Contact</div>
          <div className="footer__headline">
            Let&apos;s talk about
            <br />
            <span className="accent">your headset.</span>
          </div>
        </div>
        <div className="footer__rows">
          {CONTACT.map((row) => (
            <a
              key={row.k}
              href={row.href}
              className={`footer__row${row.cta ? " footer__row--cta" : ""}`}
              {...(row.cta ? { download: true } : {})}
              target={row.href?.startsWith("http") ? "_blank" : undefined}
              rel={row.href?.startsWith("http") ? "noreferrer" : undefined}
            >
              <span className="footer__row-k">{row.k}</span>
              <span>{row.v}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="colophon">
        <span>© 2026 Gregory Feng</span>
        <span>Set in Cormorant Garamond &amp; JetBrains Mono</span>
        <span>Build 26.07 · No gradients were harmed</span>
      </div>
    </>
  );
}
