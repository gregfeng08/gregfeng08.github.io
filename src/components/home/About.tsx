import SectionHead from "../layout/SectionHead";
import Figure from "../layout/Figure";
import { ABOUT } from "../../data/resume";
import myPhoto from "../../assets/20250624_144121.jpg";

// Bridges the original site's warm, first-person "about me" voice + portrait
// into the editorial system. The photo is the color-bearing figure.
export default function About() {
  return (
    <>
      <SectionHead num="01" title="About" note="Nice to meet you" id="about" />
      <div className="grid g-1fr-side band">
        <div className="about__body">
          <p className="about__lead">
            Hi — I&apos;m Greg. I build{" "}
            <span className="accent">mixed-reality systems</span> for headsets
            that have to actually work.
          </p>
          {ABOUT.paragraphs.map((p, i) => (
            <p className="about__text" key={i}>
              {p}
            </p>
          ))}
        </div>
        <Figure
          image={myPhoto}
          caption="FIG. 00 — G. FENG · TEMPE"
          role="the author"
          alt="Gregory Feng"
        />
      </div>
    </>
  );
}
