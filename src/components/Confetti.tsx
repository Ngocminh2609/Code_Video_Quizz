import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface ConfettiProps {
  triggerFrame?: number; // default 210
}

interface Particle {
  x: number; // initial offset
  angle: number; // launch angle
  speed: number; // launch velocity
  color: string;
  size: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'strip';
}

const COLORS = [
  '#10b981', // emerald
  '#34d399', // mint
  '#f59e0b', // amber
  '#38bdf8', // cyan
  '#ec4899', // pink
  '#a855f7', // purple
  '#ffffff', // bright white
];

// Seeded deterministic random generator
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Generate 45 deterministic particles
const PARTICLES: Particle[] = Array.from({ length: 48 }, (_, i) => {
  const r1 = pseudoRandom(i + 1);
  const r2 = pseudoRandom(i + 49);
  const r3 = pseudoRandom(i + 101);
  const r4 = pseudoRandom(i + 203);

  // Launch angle from -130deg to -50deg (fountain explosion upwards and outwards)
  const angle = -Math.PI / 2 + (r1 - 0.5) * (Math.PI * 0.85);
  const speed = 16 + r2 * 26;
  const color = COLORS[Math.floor(r3 * COLORS.length)];
  const size = 12 + r4 * 16;
  const rotationSpeed = (r1 - 0.5) * 25;
  const shape = r2 > 0.6 ? 'rect' : r2 > 0.3 ? 'strip' : 'circle';

  return {
    x: (r3 - 0.5) * 350,
    angle,
    speed,
    color,
    size,
    rotationSpeed,
    shape,
  };
});

export const Confetti: React.FC<ConfettiProps> = ({ triggerFrame = 210 }) => {
  const frame = useCurrentFrame();

  if (frame < triggerFrame) {
    return null;
  }

  const elapsed = frame - triggerFrame;
  const duration = 75; // frames

  const opacity = interpolate(elapsed, [0, 8, duration - 15, duration], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  if (opacity <= 0) return null;

  const gravity = 0.55;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {PARTICLES.map((p, index) => {
        // Physics trajectory
        const vx = Math.cos(p.angle) * p.speed;
        const vy = Math.sin(p.angle) * p.speed;

        const posX = 540 + p.x + vx * elapsed;
        const posY = 1350 + vy * elapsed + 0.5 * gravity * Math.pow(elapsed, 2);
        const rotation = p.rotationSpeed * elapsed;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${posX}px`,
              top: `${posY}px`,
              width: p.shape === 'strip' ? `${p.size * 1.8}px` : `${p.size}px`,
              height: p.shape === 'strip' ? `${p.size * 0.5}px` : `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'strip' ? '2px' : '4px',
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity,
              boxShadow: `0 0 10px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};
