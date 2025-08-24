import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import ucImg from "./assets/UnderConstruction.png"; // <-- your image
import "./App.css";

function UnderConstructionOverlay({
  onAcknowledge,
}: {
  onAcknowledge: () => void;
}) {
  return (
    <div
      className="uc-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="uc-title"
    >
      <div className="uc-modal">
        <img src={ucImg} alt="Under construction" className="uc-image" />
        <h2 id="uc-title" className="uc-title">
          This site is under construction
        </h2>
        <p className="uc-text">
          Things may be broken or change without notice.
        </p>

        <div className="uc-actions">
          <button className="uc-btn" onClick={onAcknowledge} autoFocus>
            I acknowledge
          </button>
        </div>

        <button
          className="uc-close"
          aria-label="Close"
          title="Close"
          onClick={onAcknowledge}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem("uc_ack");
    if (!acknowledged) setShowOverlay(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowOverlay(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const acknowledge = () => {
    localStorage.setItem("uc_ack", "1");
    setShowOverlay(false);
  };

  return (
    <>
      {showOverlay && <UnderConstructionOverlay onAcknowledge={acknowledge} />}

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
