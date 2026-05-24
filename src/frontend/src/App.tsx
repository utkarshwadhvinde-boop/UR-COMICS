import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import { IntroAnimation } from "./components/IntroAnimation";
import { router } from "./router";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && (
        <IntroAnimation onComplete={() => setIntroComplete(true)} />
      )}
      {introComplete && <RouterProvider router={router} />}
    </>
  );
}
