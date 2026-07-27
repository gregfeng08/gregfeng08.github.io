import SectionHead from "../layout/SectionHead";
import { NOW } from "../../data/resume";

export default function Now() {
  return (
    <>
      <SectionHead num="02" title="Now" note="Updated weekly" />
      <div className="grid g-3 band divide-r">
        {NOW.map((line, i) => (
          <div className="now__cell" key={i}>
            <div className="now__label">NOW.{String(i + 1).padStart(2, "0")}</div>
            <div className="now__line">{line}</div>
          </div>
        ))}
      </div>
    </>
  );
}
