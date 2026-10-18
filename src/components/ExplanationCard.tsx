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
        margin: '22px auto 0 auto',
        zIndex: 25,
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: 24,
          padding: '24px 28px',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          background: 'rgba(15, 23, 42, 0.92)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.25)',
        }}
      >
        {/* Header Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#34d399',
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: '0.04em',
              }}
            >
              ANSWER: {correctAnswer}
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#fbbf24',
              }}
            >
              💡 HOW IT WORKS:
            </span>
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.05em',
            }}
          >
            EXPLANATION
          </div>
        </div>

        {/* Explanation Text */}
        <p
          style={{
            margin: 0,
            fontSize: 24,
            lineHeight: 1.5,
            color: '#f1f5f9',
            fontWeight: 500,
          }}
        >
          {explanation}
        </p>

        {/* Call to Action Footer */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
            🔥 Did you get it right? Comment below! 👇
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#a855f7',
            }}
          >
            #CodingQuiz
          </div>
        </div>
      </div>
    </div>
  );
};
