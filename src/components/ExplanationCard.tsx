import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface ExplanationCardProps {
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  explanationVi?: string;
  triggerFrame?: number; // default 210
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  correctAnswer,
  explanation,
  explanationVi,
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
          padding: '20px 24px',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          background: 'rgba(15, 23, 42, 0.94)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(16, 185, 129, 0.25)',
        }}
      >
        {/* Header Tag Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                border: '1.5px solid #10b981',
                color: '#34d399',
                padding: '5px 14px',
                borderRadius: 9999,
                fontSize: 19,
                fontWeight: 900,
                letterSpacing: '0.04em',
              }}
            >
              ANSWER: {correctAnswer} • ĐÁP ÁN: {correctAnswer}
            </span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: '#fbbf24',
              }}
            >
              💡 HOW IT WORKS:
            </span>
          </div>

          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.05em',
            }}
          >
            BILINGUAL • SONG NGỮ
          </div>
        </div>

        {/* English Explanation */}
        <p
          style={{
            margin: '0 0 8px 0',
            fontSize: 22,
            lineHeight: 1.4,
            color: '#f1f5f9',
            fontWeight: 500,
          }}
        >
          🇬🇧 {explanation}
        </p>

        {/* Vietnamese Explanation */}
        {explanationVi && (
          <p
            style={{
              margin: '0 0 4px 0',
              fontSize: 22,
              lineHeight: 1.4,
              color: '#fde047', // Warm highlight for Vietnamese
              fontWeight: 600,
            }}
          >
            🇻🇳 {explanationVi}
          </p>
        )}

        {/* Bilingual Call to Action Footer */}
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.02em',
            }}
          >
            💬 Comment your score! • Bạn đoán đúng không? 👇
          </div>
          <div
            style={{
              fontSize: 17,
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
