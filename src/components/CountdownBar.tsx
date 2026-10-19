import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface CountdownBarProps {
  startFrame?: number; // default 60 (2s)
  endFrame?: number; // default 180 (6s)
}

export const CountdownBar: React.FC<CountdownBarProps> = ({
  startFrame = 60,
  endFrame = 180,
}) => {
  const frame = useCurrentFrame();

  const isBeforeStart = frame < startFrame;
  const isCounting = frame >= startFrame && frame < endFrame;
  const isFinished = frame >= endFrame;

  // Fraction of time remaining: co liên tục, cực kỳ mượt mà từ 1.0 (100%) về đúng 0.0 (0%)
  const progress = isBeforeStart
    ? 1.0
    : interpolate(frame, [startFrame, endFrame], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  // Tính số giây đếm ngược chính xác theo bước 30fps (4s ➔ 3s ➔ 2s ➔ 1s ➔ 0s)
  // Không bị giật hay nhảy số sai nhịp
  const totalSeconds = 4;
  const remainingFrames = Math.max(0, endFrame - frame);
  const secondsLeft = isBeforeStart
    ? totalSeconds
    : isFinished
      ? 0
      : Math.ceil(remainingFrames / 30);

  // Giai đoạn khẩn cấp: 1.5 giây cuối (dưới 45 frames)
  const isUrgent = isCounting && secondsLeft <= 2;
  const pulseScale = isUrgent ? 1 + Math.sin(frame * 0.25) * 0.03 : 1;

  // Dynamic color shift
  const barColor = isFinished
    ? '#10b981' // Emerald khi hết giờ
    : isUrgent
      ? '#f43f5e' // Rose khẩn cấp
      : secondsLeft <= 3
        ? '#f59e0b' // Amber
        : '#06b6d4'; // Cyan

  const glowShadow = isFinished
    ? '0 0 20px rgba(16, 185, 129, 0.6)'
    : isUrgent
      ? '0 0 22px rgba(244, 63, 94, 0.75)'
      : '0 0 18px rgba(6, 182, 212, 0.55)';

  // Độ rộng thanh progress (từ 100% xuống 0% và dừng hẳn ở 0%, KHÔNG bị giật bung ngược lại)
  const barWidth = isFinished ? 0 : progress * 100;

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
        {/* Status Text in Pure Vietnamese */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>
            {isFinished ? '🎯' : isUrgent ? '⚡' : isBeforeStart ? '⏳' : '⏱️'}
          </span>
          <span
            style={{
              fontSize: 23,
              fontWeight: 800,
              color: isFinished ? '#34d399' : isUrgent ? '#fb7185' : '#e2e8f0',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {isFinished
              ? 'HẾT GIỜ SUY NGHĨ!'
              : isUrgent
                ? 'NHANH TAY CHỐT ĐÁP ÁN!'
                : isBeforeStart
                  ? 'QUÉT ĐỀ BÀI NGAY...'
                  : 'HÃY SUY NGHĨ KỸ...'}
          </span>
        </div>

        {/* Big Numeric Timer Pill */}
        <div
          style={{
            transform: `scale(${pulseScale})`,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: `2px solid ${barColor}`,
            boxShadow: glowShadow,
            borderRadius: 9999,
            padding: '4px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 28,
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

      {/* Dynamic Animated Countdown Bar (Mượt mà 100% không CSS transition gây lag frame) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 15,
          borderRadius: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barWidth}%`,
            background: isUrgent
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
