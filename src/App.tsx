import { useCallback, useState } from "react";
import { Landing } from "@/components/Landing";
import { LogoIntro } from "@/components/LogoIntro";

function introAlreadySeen() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return sessionStorage.getItem("marini-intro") === "1";
}

export function App() {
  const [done, setDone] = useState(introAlreadySeen);
  const finishIntro = useCallback(() => setDone(true), []);

  return (
    <>
      {!done && <LogoIntro onDone={finishIntro} />}
      <Landing holdHero={!done} />
    </>
  );
}
