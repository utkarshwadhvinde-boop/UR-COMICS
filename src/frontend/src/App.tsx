import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import { IntroAnimation } from "./components/IntroAnimation";
import { MaintenancePage } from "./components/MaintenancePage";
import { router } from "./router";

const MAINTENANCE_MODE = true;
const DEV_ACCESS = localStorage.getItem("dev_access") === "true";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  if (MAINTENANCE_MODE && !DEV_ACCESS) return <MaintenancePage />;
  return (
    <>
      {!introComplete && (
        <IntroAnimation onComplete={() => setIntroComplete(true)} />
      )}
      {introComplete && <RouterProvider router={router} />}
    </>
  );
}
