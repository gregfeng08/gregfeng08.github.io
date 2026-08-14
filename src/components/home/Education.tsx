import SectionHead from "../layout/SectionHead";
import { EDUCATION } from "../../data/resume";

export default function Education() {
  return (
    <>
      <SectionHead num="05" title="Education" note="4+1 accelerated · ASU Barrett" />
      <div className="grid g-2 band">
        <div className="cell--pad" style={{ borderRight: "1px solid var(--rule-soft)" }}>
          <div className="edu__school">{EDUCATION.school}</div>
          <div className="edu__program">
            {EDUCATION.program} · {EDUCATION.when}
          </div>
          {EDUCATION.degrees.map((d) => (
            <div className="edu__degree" key={d.name}>
              <span>{d.name}</span>
              <span className="edu__gpa">{d.gpa}</span>
            </div>
          ))}
        </div>
        <div className="cell--pad">
          <div className="label" style={{ marginBottom: 14 }}>
            Awards
          </div>
          {EDUCATION.awards.map((a, i) => (
            <div className="edu__award" key={a}>
              <span className="edu__anum">{String(i + 1).padStart(2, "0")}</span>
              {a}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
