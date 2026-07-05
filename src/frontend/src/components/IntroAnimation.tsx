import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"ink" | "logo" | "tagline" | "exit">("ink");

  useEffect(() => {
    // Play sound immediately
    try {
      const audio = new Audio("/assets/intro-sound.wav");
      audio.volume = 0.7;
      audio.play().catch(() => {
        // If autoplay blocked, play on first tap
        const playOnTap = () => {
          audio.play().catch(() => {});
          document.removeEventListener("touchstart", playOnTap);
          document.removeEventListener("click", playOnTap);
        };
        document.addEventListener("touchstart", playOnTap, { once: true });
        document.addEventListener("click", playOnTap, { once: true });
      });
    } catch {}

    // Animation sequence
    const t1 = setTimeout(() => setPhase("logo"), 600);
    const t2 = setTimeout(() => setPhase("tagline"), 1400);
    const t3 = setTimeout(() => setPhase("exit"), 2800);
    const t4 = setTimeout(() => onComplete(), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
          style={{ background: "#000000" }}
        >
          {/* Ink splash circles */}
          {phase !== "ink" && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 8, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute w-40 h-40 rounded-full"
                style={{ background: "radial-gradient(circle, #7c3aed 0%, #000 70%)" }}
              />
              <motion.div
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 6, opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
                className="absolute w-32 h-32 rounded-full"
                style={{ background: "radial-gradient(circle, #dc2626 0%, #000 70%)" }}
              />
            </>
          )}

          {/* Ink drip lines */}
          {phase !== "ink" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`drip-${i}`}
                  initial={{ scaleY: 0, opacity: 0.6 }}
                  animate={{ scaleY: 1, opacity: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: "easeIn" }}
                  className="absolute top-0 w-1 rounded-full"
                  style={{
                    left: `${10 + i * 12}%`,
                    height: `${30 + Math.random() * 40}%`,
                    background: i % 2 === 0 ? "#7c3aed" : "#dc2626",
                    transformOrigin: "top",
                  }}
                />
              ))}
            </div>
          )}

          {/* Logo */}
          {(phase === "logo" || phase === "tagline") && (
            <div className="relative z-10 flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.6, ease: "backOut" }}
                className="flex flex-col items-center gap-2"
              >
                <motion.img
                  src="/assets/IMG-20260428-WA0003.jpg"
                  alt="UR COMICS"
                  className="w-24 h-24 object-contain rounded-xl"
                  animate={{
                    boxShadow: [
                      "0 0 20px #7c3aed",
                      "0 0 40px #dc2626",
                      "0 0 20px #7c3aed",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black tracking-wider"
                >
                  <span className="text-white">UR</span>
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #7c3aed, #dc2626)" }}
                  > COMICS</span>
                </motion.div>
              </motion.div>

              {/* Tagline */}
              {phase === "tagline" && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-white/50 text-sm tracking-widest uppercase font-light"
                >
                  Read. Create. Discover.
                </motion.p>
              )}
            </div>
          )}

          {/* Ink texture overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
          }
