import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface ExplanationCardProps {
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  triggerFrame?: number; // default 210
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  correctAnswer,
  explanation,
  triggerFrame = 210,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < triggerFrame) {
    return null;
  }

  // Slide up spring animation
  const entrance = spring({
    frame: frame - triggerFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 110,
      mass: 0.8,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [140, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        width: '92%',
        margin: '16px auto 0 auto',
        zIndex: 25,
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: 22,
          padding: '24px 28px',
          border: '1.5px solid rgba(16, 185, 129, 0.45)',
          background: 'rgba(15, 23, 42, 0.95)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.25)',
        }}
      >
        {/* Header Tag Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                border: '1.5px solid #10b981',
                color: '#34d399',
                padding: '6px 16px',
                borderRadius: 9999,
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: '0.04em',
              }}
            >
              ĐÁP ÁN: {correctAnswer}
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#fbbf24',
              }}
            >
              💡 GIẢI THÍCH CHI TIẾT:
            </span>
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.04em',
            }}
          >
            KIẾN THỨC
          </div>
        </div>

        {/* Pure Vietnamese Explanation Content */}
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: 25,
            lineHeight: 1.5,
            color: '#f8fafc',
            fontWeight: 600,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          {explanation}
        </p>

        {/* Call to Action Footer */}
        <div
          style={{
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.02em',
            }}
          >
            💬 Bạn đoán đúng không? Để lại bình luận nhé! 👇
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: '#a855f7',
            }}
          >
            #HocLapTrinh
          </div>
        </div>
      </div>
    </div>
  );
};
