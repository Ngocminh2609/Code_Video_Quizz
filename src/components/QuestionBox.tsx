import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { QuizOption } from '../types/quiz';

interface QuestionBoxProps {
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  revealFrame?: number; // default 210
}

export const QuestionBox: React.FC<QuestionBoxProps> = ({
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
      {/* Question Heading Banner */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          paddingLeft: 8,
        }}
      >
        <span
          style={{
            fontSize: 28,
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 12,
            padding: '6px 12px',
          }}
        >
          ❓
        </span>
        <span
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {question}
        </span>
      </div>

      {/* 4 Options Grid/Stack */}
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

          // Reveal animation spring (starts at revealFrame)
          const revealSpring = spring({
            frame: frame - revealFrame,
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          // Correct answer pop scale (up to 1.05)
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
          let backgroundColor = 'rgba(23, 28, 45, 0.75)';
          let borderColor = 'rgba(255, 255, 255, 0.1)';
          let boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';

          if (isRevealed) {
            if (isCorrect) {
              backgroundColor = 'rgba(16, 185, 129, 0.35)';
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
                  fontSize: 24,
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
                      ? '0 0 15px #10b981'
                      : 'none',
                  flexShrink: 0,
                }}
              >
                {isRevealed && isCorrect ? '✓' : opt.key}
              </div>

              {/* Option Text */}
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: isRevealed && isCorrect ? '#ffffff' : '#e2e8f0',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                  flex: 1,
                }}
              >
                {opt.text}
              </div>

              {/* Reveal Check / Cross Tag */}
              {isRevealed && isCorrect && (
                <div
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: 8,
                    padding: '4px 8px',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                  }}
                >
                  WIN
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
