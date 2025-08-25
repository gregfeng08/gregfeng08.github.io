import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import UnderConstructionOverlay from "./components/under_construction";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [showUC, setShowUC] = useState(false);

  const acknowledge = () => {
    localStorage.setItem("uc_ack", "1");
    setShowUC(false);
  };

  useEffect(() => {
    const ack = localStorage.getItem("uc_ack");
    if (!ack) {
      setShowUC(true);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowUC(false);
        }
      };
      window.addEventListener("keydown", onKey);

      return () => window.removeEventListener("keydown", onKey);
    }
  }, []);

  return (
    <>
      {showUC && <UnderConstructionOverlay onAcknowledge={acknowledge} />}
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
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
