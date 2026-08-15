'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Confetti() {
  useEffect(() => {
    const duration = 2700;
    const end = Date.now() + duration;
    const colors = ['#ef4444', '#dc2626', '#b91c1c', '#3b82f6', '#2563eb', '#1d4ed8'];
    const burstCount = 2;

    const frame = () => {
      confetti({
        particleCount: burstCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: burstCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.55 },
      colors,
    });

    frame();

    return () => {
      confetti.reset();
    };
  }, []);

  return null;
}
