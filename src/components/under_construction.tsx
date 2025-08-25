import underConstructionImg from "../assets/UnderConstruction.png";
import "./under_construction.css";

interface Props {
  onAcknowledge: () => void;
}

function UnderConstructionOverlay({ onAcknowledge }: Props) {
  return (
    <div
      className="uc-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="uc-title"
    >
      <div className="uc-modal">
        <button className="uc-close" aria-label="Close" onClick={onAcknowledge}>
          x
        </button>
        <img
          src={underConstructionImg}
          alt="Under Construction"
          className="uc-image"
        />
        <h2 id="uc-title" className="uc-title">
          This site is under construction
        </h2>
        <p className="uc-text">
          Things may be broken or in-progress, please be patient!
        </p>
        <button className="uc-ack" onClick={onAcknowledge} autoFocus>
          I understand
        </button>
      </div>
    </div>
  );
}

export default UnderConstructionOverlay;
