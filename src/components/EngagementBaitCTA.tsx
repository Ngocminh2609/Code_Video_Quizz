import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface EngagementBaitCTAProps {
  baitOptions: ['A' | 'B' | 'C' | 'D', 'A' | 'B' | 'C' | 'D'] | Array<'A' | 'B' | 'C' | 'D'>;
  triggerFrame?: number; // default 180 (giây thứ 6)
}

export const EngagementBaitCTA: React.FC<EngagementBaitCTAProps> = ({
  baitOptions,
  triggerFrame = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < triggerFrame) {
    return null;
  }

  const elapsed = frame - triggerFrame;

  // Spring entrance pop
  const entrance = spring({
    frame: elapsed,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
      mass: 0.8,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [100, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.92, 1]);

  // Pulse effect for CTA button
  const pulse = 1 + Math.sin(frame * 0.22) * 0.04;
  const glow = 15 + Math.sin(frame * 0.25) * 10;

  const opt1 = baitOptions[0] || 'A';
  const opt2 = baitOptions[1] || 'C';

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        width: '92%',
        margin: '12px auto 0 auto',
        zIndex: 30,
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: 24,
          padding: '24px 28px',
          border: '2px solid rgba(245, 158, 11, 0.75)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.92) 100%)',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 ${glow}px rgba(245, 158, 11, 0.45)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Top Header Row with High Energy Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                border: '1.5px solid #ef4444',
                color: '#f87171',
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              🔥 CUỘC CHIẾN TRANH LUẬN
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              borderRadius: 12,
              padding: '6px 14px',
              fontSize: 19,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>💬</span>
            <span>90% ĐOÁN SAI</span>
          </div>
        </div>

        {/* Central Debate Callout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.25,
              textShadow: '0 2px 14px rgba(0,0,0,0.8)',
            }}
          >
            ĐÁP ÁN LÀ{' '}
            <span
              style={{
                color: '#f59e0b',
                textDecoration: 'underline',
                textUnderlineOffset: '6px',
                textDecorationColor: '#f59e0b',
                padding: '0 4px',
              }}
            >
              {opt1}
            </span>{' '}
            HAY{' '}
            <span
              style={{
                color: '#38bdf8',
                textDecoration: 'underline',
                textUnderlineOffset: '6px',
                textDecorationColor: '#38bdf8',
                padding: '0 4px',
              }}
            >
              {opt2}
            </span>
            ?
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              color: '#cbd5e1',
              lineHeight: 1.4,
            }}
          >
            Comment xem bạn có thuộc{' '}
            <span style={{ color: '#fbbf24', fontWeight: 900 }}>10% trả lời đúng</span> không 👇
          </p>
        </div>

        {/* Interactive Simulated CTA Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            paddingTop: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>👇</span>
            <span style={{ fontSize: 21, fontWeight: 800, color: '#f1f5f9' }}>
              Viết đáp án của bạn bên dưới:
            </span>
          </div>

          <div
            style={{
              transform: `scale(${pulse})`,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#0f172a',
              fontWeight: 900,
              fontSize: 22,
              padding: '10px 24px',
              borderRadius: 14,
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: '0.02em',
              flexShrink: 0,
            }}
          >
            <span>BÌNH LUẬN NGAY</span>
            <span>✍️</span>
          </div>
        </div>
      </div>
    </div>
  );
};
