import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Confetti from "react-confetti";

export function useConfetti() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);

    // 3초 후 자동 중지
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  }, []);

  const confettiElement =
    showConfetti && typeof window !== "undefined"
      ? createPortal(
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            initialVelocityY={-20}
            colors={[
              "#f43f5e",
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#8b5cf6",
              "#ef4444",
            ]}
            style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
          />,
          document.body,
        )
      : null;

  return {
    triggerConfetti,
    confettiElement,
  };
}
