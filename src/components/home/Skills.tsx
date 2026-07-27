import SectionHead from "../layout/SectionHead";
import { SKILLS } from "../../data/resume";

export default function Skills() {
  const count = SKILLS.reduce((n, s) => n + s.items.length, 0);
  return (
    <>
      <SectionHead num="06" title="Stack" note={`${count} items`} />
      <div className="grid g-4 band divide-r">
        {SKILLS.map((s) => (
          <div className="skill__cell" key={s.group}>
            <div className="skill__group">{s.group}</div>
            {s.items.map((it) => (
              <div className="skill__item" key={it}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
