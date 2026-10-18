import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface CountdownTimerProps {
  startFrame?: number; // default 30
  endFrame?: number; // default 210
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
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

  // Seconds display (counting down from 5 to 1)
  const totalSeconds = 5;
  const secondsLeft = Math.max(0, Math.ceil(progress * totalSeconds));

  // Visual urgency threshold: last 2 seconds (frame > 150)
  const isUrgent = isCounting && secondsLeft <= 2;
  const heartbeat = isUrgent ? 1 + Math.sin(frame * 0.45) * 0.12 : 1;

  // Color shifting as time runs out: Cyan -> Amber -> Bright Rose/Red
  const ringColor = isUrgent
    ? '#f43f5e' // Rose
    : secondsLeft <= 3
      ? '#f59e0b' // Amber
      : '#06b6d4'; // Cyan

  // Circular SVG params
  const size = 105;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        margin: '14px 0',
        zIndex: 15,
      }}
    >
      {/* Circular Timer Display */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          transform: `scale(${heartbeat})`,
        }}
      >
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Countdown Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isFinished ? '#10b981' : ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isFinished ? 0 : strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 10px ${isFinished ? '#10b981' : ringColor})`,
            }}
          />
        </svg>

        {/* Center Countdown Number / Icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {isFinished ? (
            <span style={{ fontSize: 34 }}>🎯</span>
          ) : (
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                fontFamily: 'var(--font-sans)',
                color: ringColor,
                lineHeight: 1,
                textShadow: `0 0 14px ${ringColor}`,
              }}
            >
              {secondsLeft}s
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Status Tag (Bilingual EN + VI) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: isFinished ? '#34d399' : isUrgent ? '#fb7185' : '#e2e8f0',
            textTransform: 'uppercase',
          }}
        >
          {isFinished
            ? "Time's Up! • Hết Giờ! 🎯"
            : isUrgent
              ? 'Quick! Guess Now! • Đoán Ngay!'
              : 'Think Carefully... • Hãy Suy Nghĩ...'}
        </div>
        <div
          style={{
            fontSize: 17,
            color: '#94a3b8',
            fontWeight: 600,
            marginTop: 3,
          }}
        >
          {isFinished
            ? 'Answer revealed below • Đáp án bên dưới 👇'
            : 'Lock in your answer • Khóa câu trả lời của bạn!'}
        </div>
      </div>
    </div>
  );
};
