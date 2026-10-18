import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface CountdownBarProps {
  startFrame?: number; // default 30
  endFrame?: number; // default 210
}

export const CountdownBar: React.FC<CountdownBarProps> = ({
  startFrame = 30,
  endFrame = 210,
}) => {
  const frame = useCurrentFrame();

  const isCounting = frame >= startFrame && frame < endFrame;
  const isFinished = frame >= endFrame;

  // Fraction of time remaining from 1.0 down to 0.0
  const progress = interpolate(frame, [startFrame, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Seconds display (counting down from 5 to 0)
  const totalSeconds = 5;
  const secondsLeft = Math.max(0, Math.ceil(progress * totalSeconds));

  // Visual urgency threshold: last 2 seconds
  const isUrgent = isCounting && secondsLeft <= 2;
  const heartbeat = isUrgent ? 1 + Math.sin(frame * 0.45) * 0.08 : 1;

  // Dynamic color shift
  const barColor = isFinished
    ? '#10b981' // Emerald
    : isUrgent
      ? '#f43f5e' // Rose
      : secondsLeft <= 3
        ? '#f59e0b' // Amber
        : '#06b6d4'; // Cyan

  const glowShadow = isFinished
    ? '0 0 25px rgba(16, 185, 129, 0.7)'
    : isUrgent
      ? '0 0 25px rgba(244, 63, 94, 0.8)'
      : '0 0 20px rgba(6, 182, 212, 0.6)';

  return (
    <div
      style={{
        width: '92%',
        margin: '12px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 15,
      }}
    >
      {/* Top Header Row: Status & Numeric Timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Status Text (Bilingual) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{isFinished ? '🎯' : isUrgent ? '⚡' : '⏱️'}</span>
          <span
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: isFinished ? '#34d399' : isUrgent ? '#fb7185' : '#e2e8f0',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {isFinished
              ? "Time's Up! • Hết Giờ!"
              : isUrgent
                ? 'Quick! Guess Now! • Đoán Ngay!'
                : 'Think Carefully • Hãy Suy Nghĩ...'}
          </span>
        </div>

        {/* Big Numeric Timer Pill */}
        <div
          style={{
            transform: `scale(${heartbeat})`,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: `2px solid ${barColor}`,
            boxShadow: glowShadow,
            borderRadius: 9999,
            padding: '4px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: barColor,
              lineHeight: 1,
            }}
          >
            {isFinished ? '0s' : `${secondsLeft}s`}
          </span>
        </div>
      </div>

      {/* Dynamic Animated Countdown Bar */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 14,
          borderRadius: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: isFinished ? '100%' : `${progress * 100}%`,
            background: isFinished
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : isUrgent
                ? 'linear-gradient(90deg, #f43f5e, #fb7185)'
                : secondsLeft <= 3
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #06b6d4, #38bdf8)',
            borderRadius: 9999,
            boxShadow: glowShadow,
          }}
        />
      </div>
    </div>
  );
};
