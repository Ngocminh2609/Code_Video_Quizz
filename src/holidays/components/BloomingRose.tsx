import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const BloomingRose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Hiệu ứng nở hoa mượt mà (0s - 2.8s)
  const bloomSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 45, mass: 1 },
  });

  const bloomScale = interpolate(bloomSpring, [0, 1], [0.35, 1]);
  const bloomRotate = interpolate(bloomSpring, [0, 1], [-25, 0]);
  const bloomOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Chuyển động đung đưa nhẹ nhàng theo gió (Gentle organic swaying)
  const swayAngle = Math.sin(frame * 0.045) * 2.2;
  const swayX = Math.sin(frame * 0.045) * 6;
  const breatheScale = 1 + Math.sin(frame * 0.06) * 0.02;

  // 3. Hiệu ứng ánh sáng đỏ phát sáng nhẹ (glowing red glow)
  const glowIntensity = 25 + Math.sin(frame * 0.08) * 10;
  const auraOpacity = 0.55 + Math.sin(frame * 0.06) * 0.15;

  return (
    <div
      style={{
        position: 'relative',
        width: 520,
        height: 640,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${swayX}px) rotate(${swayAngle}deg) scale(${breatheScale})`,
        transformOrigin: 'bottom center',
        opacity: bloomOpacity,
      }}
    >
      {/* Vầng hào quang phát sáng đỏ ruby (Soft Rose Glow Aura) */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(225, 29, 72, 0.22) 40%, transparent 70%)',
          filter: `blur(${glowIntensity}px)`,
          opacity: auraOpacity,
          pointerEvents: 'none',
        }}
      />

      <svg
        width="500"
        height="620"
        viewBox="0 0 500 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity * 0.6}px rgba(225, 29, 72, 0.65)) drop-shadow(0 15px 30px rgba(0,0,0,0.6))`,
        }}
      >
        <defs>
          {/* Gradients cho các tầng cánh hoa hồng đỏ nhung */}
          <radialGradient id="outerPetalGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="45%" stopColor="#e11d48" />
            <stop offset="85%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          <radialGradient id="midPetalGrad" cx="45%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="40%" stopColor="#e11d48" />
            <stop offset="80%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          <radialGradient id="innerPetalGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="30%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#58081a" />
          </radialGradient>

          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="40%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
        </defs>

        {/* 🌿 1. Thân cành hoa uốn lượn tự nhiên */}
        <path
          d="M250 360 C 248 430, 260 500, 245 600"
          stroke="url(#stemGrad)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Lá bên trái */}
        <g transform="translate(185, 420) rotate(-22)">
          <path
            d="M 60 40 C 20 20, 0 50, -35 45 C 5 75, 40 70, 60 40 Z"
            fill="url(#leafGrad)"
            stroke="#34d399"
            strokeWidth="1.5"
          />
          <path d="M 60 40 Q 20 48 -35 45" stroke="#6ee7b7" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>

        {/* Lá bên phải */}
        <g transform="translate(255, 465) rotate(18)">
          <path
            d="M 0 35 C 40 15, 60 45, 95 40 C 55 70, 20 65, 0 35 Z"
            fill="url(#leafGrad)"
            stroke="#34d399"
            strokeWidth="1.5"
          />
          <path d="M 0 35 Q 40 43 95 40" stroke="#6ee7b7" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>

        {/* Đài hoa xanh nâng đỡ hoa (Sepals) */}
        <path d="M225 350 Q 250 375 275 350 Q 250 395 225 350 Z" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
        <path d="M210 340 Q 215 370 230 380 Q 210 365 210 340 Z" fill="#065f46" />
        <path d="M290 340 Q 285 370 270 380 Q 290 365 290 340 Z" fill="#065f46" />

        {/* 🌹 2. Bông hoa hồng nở dần (Blooming Rose Head) */}
        <g
          transform={`translate(250, 235) scale(${bloomScale}) rotate(${bloomRotate}) translate(-250, -235)`}
          style={{ transformOrigin: '250px 235px' }}
        >
          {/* Tầng 1: Cánh ngoài lớn nhất xòe rộng */}
          <path
            d="M170 210 C 140 140, 210 110, 250 140 C 290 110, 360 140, 330 210 C 370 270, 310 340, 250 330 C 190 340, 130 270, 170 210 Z"
            fill="url(#outerPetalGrad)"
            stroke="#fda4af"
            strokeWidth="1.5"
            opacity="0.95"
          />

          {/* Tầng 2: Cánh uốn lượn trái phải */}
          <path
            d="M185 240 C 160 180, 220 140, 250 170 C 250 220, 190 270, 185 240 Z"
            fill="url(#midPetalGrad)"
            stroke="#fecdd3"
            strokeWidth="1.2"
          />
          <path
            d="M315 240 C 340 180, 280 140, 250 170 C 250 220, 310 270, 315 240 Z"
            fill="url(#midPetalGrad)"
            stroke="#fecdd3"
            strokeWidth="1.2"
          />

          {/* Cánh ôm phía dưới */}
          <path
            d="M200 270 C 220 315, 280 315, 300 270 C 315 290, 275 320, 250 320 C 225 320, 185 290, 200 270 Z"
            fill="url(#midPetalGrad)"
            stroke="#ffe4e6"
            strokeWidth="1.2"
          />

          {/* Tầng 3: Lớp cánh ôm giữa nở e ấp */}
          <path
            d="M215 210 C 205 165, 260 160, 280 185 C 295 210, 275 255, 250 255 C 225 255, 220 230, 215 210 Z"
            fill="url(#innerPetalGrad)"
            stroke="#fff1f2"
            strokeWidth="1.4"
          />
          <path
            d="M285 210 C 295 165, 240 160, 220 185 C 205 210, 225 255, 250 255 C 275 255, 280 230, 285 210 Z"
            fill="url(#innerPetalGrad)"
            stroke="#fff1f2"
            strokeWidth="1.4"
            opacity="0.9"
          />

          {/* Tầng 4: Trái tim xoắn ốc hoa hồng (Spiral Heart Core) */}
          <path
            d="M238 205 C 235 185, 255 180, 262 195 C 268 210, 255 220, 246 215 C 240 210, 242 200, 250 202"
            fill="#be123c"
            stroke="#ffe4e6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
