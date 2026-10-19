import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface InDepthExplanationCardProps {
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  inDepthExplanation?: string;
  inDepthPoints?: string[];
  triggerFrame?: number; // default 180 (giây thứ 6)
}

export const InDepthExplanationCard: React.FC<InDepthExplanationCardProps> = ({
  correctAnswer,
  explanation,
  inDepthExplanation,
  inDepthPoints = [],
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
      damping: 14,
      stiffness: 120,
      mass: 0.8,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [120, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Pulse effect for Save & Share CTA button
  const pulse = 1 + Math.sin(frame * 0.2) * 0.04;
  const glow = 15 + Math.sin(frame * 0.2) * 10;

  const displayDetail = inDepthExplanation || explanation;

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
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
          border: '2px solid rgba(16, 185, 129, 0.75)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(6, 78, 59, 0.9) 100%)',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 ${glow}px rgba(16, 185, 129, 0.45)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Top Header: Đáp Án Đúng & Tag Chuyên Sâu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '6px 18px',
                borderRadius: 9999,
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: '0.04em',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
              }}
            >
              ✓ ĐÁP ÁN: {correctAnswer}
            </span>
            <span
              style={{
                fontSize: 21,
                fontWeight: 800,
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>⚙️</span>
              <span>CƠ CHẾ BÊN DƯỚI (UNDER THE HOOD)</span>
            </span>
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#34d399',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '4px 14px',
              borderRadius: 10,
            }}
          >
            PHỎNG VẤN SENIOR
          </div>
        </div>

        {/* In-depth explanation paragraph */}
        <p
          style={{
            margin: 0,
            fontSize: 23,
            lineHeight: 1.45,
            color: '#f8fafc',
            fontWeight: 600,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          {displayDetail}
        </p>

        {/* Specific Bullet Points if provided */}
        {inDepthPoints.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 14,
              padding: '12px 18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {inDepthPoints.map((pt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: '#10b981', fontSize: 18, marginTop: 2 }}>🔹</span>
                <span style={{ fontSize: 20, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.35 }}>
                  {pt}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Call To Action: Lưu lại để ôn phỏng vấn! 📌 */}
        <div
          style={{
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>📌</span>
            <span
              style={{
                fontSize: 23,
                fontWeight: 900,
                color: '#fef08a',
                letterSpacing: '-0.01em',
              }}
            >
              Lưu lại để ôn tập 📌
            </span>
          </div>

          <div
            style={{
              transform: `scale(${pulse})`,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 21,
              padding: '10px 24px',
              borderRadius: 14,
              boxShadow: '0 0 22px rgba(16, 185, 129, 0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: '0.02em',
              flexShrink: 0,
            }}
          >
            <span>BẤM LƯU NGAY</span>
            <span>🔖</span>
          </div>
        </div>
      </div>
    </div>
  );
};
