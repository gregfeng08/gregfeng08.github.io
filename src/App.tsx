import { useEffect, useState } from "react";
import UnderConstructionOverlay from "./components/under_construction";
import NavigationBar from "./components/nav_bar";
import PhotoOverlay from "./components/photo_overlay";
import "./App.css";

function App() {
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
      <NavigationBar />
      {showUC && <UnderConstructionOverlay onAcknowledge={acknowledge} />}
      <div>
        <PhotoOverlay />
      </div>
      <div className="about-backdrop">
        <h1 className="about-title">A little bit about me...</h1>
        <p className="about-text">
          Hi, I'm Gregory Feng, a current accelerated Master's student at
          Arizona State University! I'm currently doing my accelerated year with
          thesis under Dr. Elina Ollila and Dr. Yinong Chen. My interests are in
          AR/VR development, game development, and computer graphics. I'm
          currently looking for employment for the 2026 year after I graduate
          from this program. Nice to meet you!
        </p>
      </div>
    </>
  );
}

export default App;
