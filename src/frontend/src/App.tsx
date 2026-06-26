import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import { IntroAnimation } from "./components/IntroAnimation";
import { MaintenancePage } from "./components/MaintenancePage";
import { router } from "./router";

const MAINTENANCE_MODE = true;

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  if (MAINTENANCE_MODE) return <MaintenancePage />;

  return (
    <>
      {!introComplete && (
        <IntroAnimation onComplete={() => setIntroComplete(true)} />
      )}
      {introComplete && <RouterProvider router={router} />}
    </>
  );
}
