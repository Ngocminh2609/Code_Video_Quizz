import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';

interface ParticleDef {
  angle: number;
  speed: number;
  size: number;
  color: string;
  decay: number;
}

interface FireworkBurst {
  id: number;
  cornerIndex: number; // 0: Top-Left, 1: Top-Right, 2: Bottom-Left, 3: Bottom-Right
  startFrame: number;
  travelFrames: number;
  explodeFrames: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  particles: ParticleDef[];
}

const COLORS = [
  '#F59E0B', // Vàng hoàng gia
  '#FDE047', // Vàng sáng
  '#EC4899', // Hồng đào
  '#F472B6', // Hồng phấn
  '#EF4444', // Đỏ ruby
  '#A855F7', // Tím hoa cà
  '#C084FC', // Tím nhạt
];

export const CornerFireworks: React.FC = () => {
  const frame = useCurrentFrame();

  const bursts = useMemo<FireworkBurst[]>(() => {
    const list: FireworkBurst[] = [];
    const totalBursts = 28;
    const corners = [
      { x: 30, y: 30, tx: 320, ty: 420 }, // Top-Left
      { x: 1050, y: 30, tx: 760, ty: 420 }, // Top-Right
      { x: 30, y: 1890, tx: 330, ty: 1420 }, // Bottom-Left
      { x: 1050, y: 1890, tx: 750, ty: 1420 }, // Bottom-Right
    ];

    for (let i = 0; i < totalBursts; i++) {
      const cIdx = i % 4;
      const corner = corners[cIdx];
      const startFrame = 5 + i * 14;
      const travelFrames = 12;
      const explodeFrames = 26;

      const particles: ParticleDef[] = [];
      const particleCount = 28;
      for (let p = 0; p < particleCount; p++) {
        const angle = (p / particleCount) * Math.PI * 2 + (i * 0.4);
        const speed = 2.5 + (p % 5) * 1.6;
        const color = COLORS[(p + i * 2) % COLORS.length];
        particles.push({
          angle,
          speed,
          size: 2.5 + (p % 3) * 1.2,
          color,
          decay: 0.95,
        });
      }

      // Biến thiên nhẹ điểm nổ hướng vào giữa
      const offsetX = ((i * 37) % 120) - 60;
      const offsetY = ((i * 53) % 120) - 60;

      list.push({
        id: i,
        cornerIndex: cIdx,
        startFrame,
        travelFrames,
        explodeFrames,
        startX: corner.x,
        startY: corner.y,
        targetX: corner.tx + offsetX,
        targetY: corner.ty + offsetY,
        particles,
      });
    }

    return list;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        pointerEvents: 'none',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {bursts.map((burst) => {
        const timeFromStart = frame - burst.startFrame;
        if (timeFromStart < 0 || timeFromStart > burst.travelFrames + burst.explodeFrames) {
          return null;
        }

        // 1. Giai đoạn bay từ góc vào tâm
        if (timeFromStart <= burst.travelFrames) {
          const progress = timeFromStart / burst.travelFrames;
          const currentX = burst.startX + (burst.targetX - burst.startX) * progress;
          const currentY = burst.startY + (burst.targetY - burst.startY) * progress;

          return (
            <div
              key={`rocket-${burst.id}`}
              style={{
                position: 'absolute',
                left: currentX,
                top: currentY,
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 16px #fde047, 0 0 28px #f59e0b',
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        }

        // 2. Giai đoạn nổ tung tóe từ tâm điểm nổ (Particle Burst)
        const explodeTime = timeFromStart - burst.travelFrames;
        const progress = explodeTime / burst.explodeFrames;
        const opacity = Math.max(0, 1 - progress);

        return (
          <React.Fragment key={`burst-${burst.id}`}>
            {/* Chớp sáng trung tâm vụ nổ */}
            {explodeTime <= 4 && (
              <div
                style={{
                  position: 'absolute',
                  left: burst.targetX,
                  top: burst.targetY,
                  width: 50 * (1 - explodeTime / 4),
                  height: 50 * (1 - explodeTime / 4),
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #ffffff 0%, rgba(254, 240, 138, 0.8) 50%, transparent 100%)',
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(4px)',
                }}
              />
            )}

            {/* Các hạt pháo hoa nhiều màu sắc tỏa ra 360 độ */}
            {burst.particles.map((p, pIdx) => {
              const distance = p.speed * explodeTime * (1 - progress * 0.45);
              const gravity = 0.12 * explodeTime * explodeTime;
              const px = burst.targetX + Math.cos(p.angle) * distance;
              const py = burst.targetY + Math.sin(p.angle) * distance + gravity;
              const sparkle = (pIdx + frame) % 2 === 0 ? 1 : 0.7;

              return (
                <div
                  key={`p-${burst.id}-${pIdx}`}
                  style={{
                    position: 'absolute',
                    left: px,
                    top: py,
                    width: p.size * (1 - progress * 0.3),
                    height: p.size * (1 - progress * 0.3),
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
                    opacity: opacity * sparkle,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
