import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { QuizOption } from '../types';

interface OptionsGridProps {
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  revealFrame?: number; // default 210
}

export const OptionsGrid: React.FC<OptionsGridProps> = ({
  question,
  options,
  correctAnswer,
  revealFrame = 210,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance for Question Title
  const titleEntrance = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleY = interpolate(titleEntrance, [0, 1], [20, 0]);

  const isRevealed = frame >= revealFrame;

  return (
    <div
      style={{
        width: '92%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
      }}
    >
      {/* Question Heading Banner in Pure Vietnamese */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          paddingLeft: 6,
        }}
      >
        <span
          style={{
            fontSize: 28,
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            border: '1px solid rgba(99, 102, 241, 0.45)',
            borderRadius: 12,
            padding: '6px 14px',
          }}
        >
          ❓
        </span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            lineHeight: 1.3,
          }}
        >
          {question}
        </span>
      </div>

      {/* 4-Option Trắc Nghiệm Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {options.map((opt, index) => {
          // Staggered entrance for each option
          const delay = 18 + index * 6;
          const optEntrance = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 120 },
          });

          const optY = interpolate(optEntrance, [0, 1], [30, 0]);
          const optOpacity = interpolate(optEntrance, [0, 1], [0, 1]);

          const isCorrect = opt.key === correctAnswer;

          // Reveal animation spring
          const revealSpring = spring({
            frame: frame - revealFrame,
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          // Correct answer pop scale
          const revealScale = isRevealed && isCorrect
            ? interpolate(revealSpring, [0, 1], [1, 1.05])
            : 1;

          // Dimming incorrect answers
          const finalOpacity = isRevealed
            ? isCorrect
              ? 1
              : interpolate(revealSpring, [0, 1], [1, 0.35])
            : optOpacity;

          // Background styles depending on state
          let backgroundColor = 'rgba(23, 28, 45, 0.8)';
          let borderColor = 'rgba(255, 255, 255, 0.12)';
          let boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';

          if (isRevealed) {
            if (isCorrect) {
              backgroundColor = 'rgba(16, 185, 129, 0.38)';
              borderColor = '#10b981';
              boxShadow =
                '0 0 35px rgba(16, 185, 129, 0.6), inset 0 0 20px rgba(16, 185, 129, 0.3)';
            } else {
              backgroundColor = 'rgba(15, 20, 32, 0.4)';
              borderColor = 'rgba(244, 63, 94, 0.2)';
            }
          }

          return (
            <div
              key={opt.key}
              style={{
                transform: `translateY(${optY}px) scale(${revealScale})`,
                opacity: finalOpacity,
                backgroundColor,
                border: `2px solid ${borderColor}`,
                borderRadius: 18,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Option Key Badge [A], [B], [C], [D] */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 25,
                  fontWeight: 900,
                  backgroundColor:
                    isRevealed && isCorrect
                      ? '#10b981'
                      : 'rgba(255, 255, 255, 0.1)',
                  color:
                    isRevealed && isCorrect
                      ? '#ffffff'
                      : '#cbd5e1',
                  boxShadow:
                    isRevealed && isCorrect
                      ? '0 0 16px #10b981'
                      : 'none',
                  flexShrink: 0,
                }}
              >
                {isRevealed && isCorrect ? '✓' : opt.key}
              </div>

              {/* Option Text Content */}
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: isRevealed && isCorrect ? '#ffffff' : '#f1f5f9',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                  flex: 1,
                }}
              >
                {opt.text}
              </div>

              {/* CHÍNH XÁC Badge */}
              {isRevealed && isCorrect && (
                <div
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: 8,
                    padding: '5px 10px',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                  }}
                >
                  ĐÚNG
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
