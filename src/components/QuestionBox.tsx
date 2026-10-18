import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { QuizOption } from '../types/quiz';

interface QuestionBoxProps {
  question: string;
  questionVi?: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  revealFrame?: number; // default 210
}

export const QuestionBox: React.FC<QuestionBoxProps> = ({
  question,
  questionVi,
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
      {/* Bilingual Question Heading Banner */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 14,
          paddingLeft: 6,
        }}
      >
        <span
          style={{
            fontSize: 26,
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 12,
            padding: '6px 12px',
            marginTop: 2,
          }}
        >
          ❓
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* English Question */}
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              lineHeight: 1.25,
            }}
          >
            {question}
          </span>
          {/* Vietnamese Question Translation */}
          {questionVi && (
            <span
              style={{
                fontSize: 23,
                fontWeight: 700,
                color: '#38bdf8', // Cyan translation label
                lineHeight: 1.2,
              }}
            >
              🇻🇳 {questionVi}
            </span>
          )}
        </div>
      </div>

      {/* 4 Options Grid/Stack */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
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
          let backgroundColor = 'rgba(23, 28, 45, 0.78)';
          let borderColor = 'rgba(255, 255, 255, 0.1)';
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
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Option Key Badge [A], [B], [C], [D] */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 23,
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

              {/* Option Text (Bilingual support) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: isRevealed && isCorrect ? '#ffffff' : '#e2e8f0',
                    lineHeight: 1.25,
                    wordBreak: 'break-word',
                  }}
                >
                  {opt.text}
                </div>
                {opt.textVi && opt.textVi !== opt.text && (
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: isRevealed && isCorrect ? '#a7f3d0' : '#94a3b8',
                      lineHeight: 1.2,
                    }}
                  >
                    ({opt.textVi})
                  </div>
                )}
              </div>

              {/* Reveal Check / Cross Tag */}
              {isRevealed && isCorrect && (
                <div
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: 8,
                    padding: '4px 8px',
                    fontSize: 15,
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
