import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacityBase: number;
}

export const HolidayBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const stars = useMemo<StarParticle[]>(() => {
    return Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: ((i * 137.5 + 43) % 1080),
      y: ((i * 241.7 + 97) % 1920),
      size: (i % 3) + 1.5,
      speed: 0.3 + (i % 5) * 0.15,
      opacityBase: 0.25 + (i % 4) * 0.2,
    }));
  }, []);

  const pulseGlow = Math.sin(frame * 0.04) * 0.12;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, #1e0933 0%, #0d061e 45%, #05020c 75%, #020108 100%)',
        zIndex: 0,
      }}
    >
      {/* Hào quang tím midnight & đỏ ruby mờ ảo trung tâm */}
      <div
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 850,
          height: 850,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.22) 0%, rgba(147, 51, 234, 0.16) 40%, transparent 70%)',
          filter: 'blur(70px)',
          opacity: 0.85 + pulseGlow,
          pointerEvents: 'none',
        }}
      />

      {/* Ánh sáng vàng đồng mạ kim dưới chân text */}
      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 750,
          height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Hạt sao bụi vàng lơ lửng */}
      {stars.map((star) => {
        const currentY = (star.y - frame * star.speed + 1920) % 1920;
        const twinkle = Math.sin(frame * 0.08 + star.id) * 0.35;
        const opacity = Math.min(1, Math.max(0.1, star.opacityBase + twinkle));

        return (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: star.x,
              top: currentY,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: star.id % 2 === 0 ? '#fef08a' : '#f43f5e',
              boxShadow: `0 0 ${star.size * 3}px ${star.id % 2 === 0 ? 'rgba(253, 224, 71, 0.8)' : 'rgba(244, 63, 94, 0.8)'}`,
              opacity,
            }}
          />
        );
      })}

      {/* Viền tối huyền bí (Vignette) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 160px rgba(0, 0, 0, 0.85)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
