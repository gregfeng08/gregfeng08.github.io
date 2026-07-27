import SectionHead from "../layout/SectionHead";
import { WORK } from "../../data/resume";

export default function Work() {
  return (
    <>
      <SectionHead num="04" title="Work" note={`N=${WORK.length}`} id="work" />
      <div className="grid g-2 band divide-r">
        {WORK.map((w) => (
          <div className="work__cell" key={w.company}>
            <div className="work__when">
              {w.when} · {w.where}
            </div>
            <div className="work__company">{w.company}</div>
            <div className="work__role">{w.role}</div>
            {w.bullets.map((b, j) => (
              <div className="work__bullet" key={j}>
                <span className="work__bnum">{String(j + 1).padStart(2, "0")}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
