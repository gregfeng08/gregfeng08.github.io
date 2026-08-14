import { HERO_INFO } from "../../data/resume";

export default function Hero() {
  return (
    <div className="grid g-1fr-side band">
      <div className="hero__main">
        <div className="kicker hero__kicker">
          XR · Graphics · Systems
        </div>
        <h1 className="hero__title serif">
          Gregory
          <br />
          <span className="italic accent">Feng.</span>
        </h1>
        <p className="hero__standfirst">
          Mixed-reality systems for headsets that have to actually work: the
          meshes, the shaders, and the plumbing that keeps a Quest 3 honest.
        </p>
      </div>
      <div className="hero__side">
        {HERO_INFO.map(([k, v, sub]) => (
          <div className="infocell" key={k}>
            <div className="infocell__k">{k}</div>
            <div className="infocell__v">{v}</div>
            <div className="infocell__sub">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
