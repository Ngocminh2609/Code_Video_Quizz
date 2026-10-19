import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DisplayMode, QuizOption } from '../types';

interface OptionsGridProps {
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  baitOptions?: Array<'A' | 'B' | 'C' | 'D'>;
  displayMode?: DisplayMode; // 'engagement-bait' | 'in-depth'
  revealFrame?: number; // default 180 (giây thứ 6)
}

export const OptionsGrid: React.FC<OptionsGridProps> = ({
  question,
  options,
  correctAnswer,
  baitOptions,
  displayMode = 'engagement-bait',
  revealFrame = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Khung options xuất hiện ngầm từ frame 0 để người xem quét đề bài ngay
  // Từ frame 36 - 60 tăng dần độ sáng lên 100%
  const gridBrightness = interpolate(frame, [36, 60], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isRevealed = frame >= revealFrame;

  // Xác định 2 phương án gây lú nhất:
  // Nếu có baitOptions thì dùng baitOptions, nếu không thì tự suy luận (correctAnswer + 1 option khác)
  const resolvedBaitKeys: Array<'A' | 'B' | 'C' | 'D'> = React.useMemo(() => {
    if (baitOptions && baitOptions.length >= 2) {
      return baitOptions;
    }
    const otherKeys = options
      .map((o) => o.key)
      .filter((k) => k !== correctAnswer);
    const counterpart = otherKeys[0] || 'A';
    return [correctAnswer, counterpart].sort();
  }, [baitOptions, options, correctAnswer]);

  return (
    <div
      style={{
        width: '92%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        filter: `brightness(${gridBrightness})`,
      }}
    >
      {/* Question Heading Banner in Pure Vietnamese */}
      <div
        style={{
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
        {options.map((opt) => {
          const isCorrect = opt.key === correctAnswer;
          const isBaitCandidate = resolvedBaitKeys.includes(opt.key);

          // Reveal animation spring
          const revealSpring = spring({
            frame: frame - revealFrame,
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          // Pulse nhấp nháy cho 2 phương án gây lú ở mode engagement-bait
          const baitPulse = 1 + Math.sin(frame * 0.22) * 0.035;
          const baitGlow = 18 + Math.sin(frame * 0.25) * 12;

          let backgroundColor = 'rgba(23, 28, 45, 0.85)';
          let borderColor = 'rgba(255, 255, 255, 0.14)';
          let boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45)';
          let cardScale = 1;
          let cardOpacity = 1;

          // 🔹 XỬ LÝ THEO CHẾ ĐỘ Ở GIAI ĐOẠN 3 (FRAME >= revealFrame)
          if (isRevealed) {
            if (displayMode === 'engagement-bait') {
              // 🔴 LỰA CHỌN A: ENGAGEMENT-BAIT (TUYỆT ĐỐI KHÔNG HIỂN THỊ ĐÁP ÁN ĐÚNG)
              if (isBaitCandidate) {
                // Giữ lại 2 đáp án gây lú nhất -> Nhấp nháy thăm dò
                backgroundColor = 'rgba(30, 41, 59, 0.95)';
                borderColor = opt.key === resolvedBaitKeys[0] ? '#f59e0b' : '#38bdf8';
                boxShadow = `0 0 ${baitGlow}px ${
                  opt.key === resolvedBaitKeys[0]
                    ? 'rgba(245, 158, 11, 0.65)'
                    : 'rgba(56, 189, 248, 0.65)'
                }`;
                cardScale = baitPulse;
                cardOpacity = 1;
              } else {
                // Khóa / làm mờ 2 phương án hiển nhiên sai
                backgroundColor = 'rgba(15, 20, 32, 0.35)';
                borderColor = 'rgba(255, 255, 255, 0.06)';
                boxShadow = 'none';
                cardScale = 0.96;
                cardOpacity = interpolate(revealSpring, [0, 1], [1, 0.22]);
              }
            } else {
              // 🟢 LỰA CHỌN B: IN-DEPTH (HIỂN THỊ ĐÁP ÁN ĐÚNG)
              if (isCorrect) {
                backgroundColor = 'rgba(16, 185, 129, 0.38)';
                borderColor = '#10b981';
                boxShadow =
                  '0 0 35px rgba(16, 185, 129, 0.65), inset 0 0 20px rgba(16, 185, 129, 0.3)';
                cardScale = interpolate(revealSpring, [0, 1], [1, 1.05]);
                cardOpacity = 1;
              } else {
                backgroundColor = 'rgba(15, 20, 32, 0.4)';
                borderColor = 'rgba(244, 63, 94, 0.2)';
                cardScale = 1;
                cardOpacity = interpolate(revealSpring, [0, 1], [1, 0.3]);
              }
            }
          }

          return (
            <div
              key={opt.key}
              style={{
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
                backgroundColor,
                border: `2px solid ${borderColor}`,
                borderRadius: 20,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              {/* Option Key Badge [A], [B], [C], [D] */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 900,
                  backgroundColor:
                    isRevealed && displayMode === 'in-depth' && isCorrect
                      ? '#10b981'
                      : isRevealed && displayMode === 'engagement-bait' && isBaitCandidate
                        ? opt.key === resolvedBaitKeys[0]
                          ? '#f59e0b'
                          : '#0284c7'
                        : 'rgba(255, 255, 255, 0.1)',
                  color:
                    isRevealed &&
                    ((displayMode === 'in-depth' && isCorrect) ||
                      (displayMode === 'engagement-bait' && isBaitCandidate))
                      ? '#ffffff'
                      : '#cbd5e1',
                  boxShadow:
                    isRevealed && displayMode === 'in-depth' && isCorrect
                      ? '0 0 16px #10b981'
                      : 'none',
                  flexShrink: 0,
                }}
              >
                {isRevealed && displayMode === 'in-depth' && isCorrect
                  ? '✓'
                  : isRevealed && displayMode === 'engagement-bait' && !isBaitCandidate
                    ? '🔒'
                    : opt.key}
              </div>

              {/* Option Text Content */}
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color:
                    isRevealed && displayMode === 'in-depth' && isCorrect
                      ? '#ffffff'
                      : isRevealed && displayMode === 'engagement-bait' && isBaitCandidate
                        ? '#ffffff'
                        : '#e2e8f0',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                  flex: 1,
                }}
              >
                {opt.text}
              </div>

              {/* Badges theo chế độ */}
              {isRevealed && displayMode === 'in-depth' && isCorrect && (
                <div
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: 8,
                    padding: '5px 12px',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
                  }}
                >
                  ĐÚNG
                </div>
              )}

              {isRevealed && displayMode === 'engagement-bait' && isBaitCandidate && (
                <div
                  style={{
                    backgroundColor:
                      opt.key === resolvedBaitKeys[0]
                        ? 'rgba(245, 158, 11, 0.25)'
                        : 'rgba(56, 189, 248, 0.25)',
                    border: `1.5px solid ${opt.key === resolvedBaitKeys[0] ? '#f59e0b' : '#38bdf8'}`,
                    color: opt.key === resolvedBaitKeys[0] ? '#fcd34d' : '#7dd3fc',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                  }}
                >
                  {opt.key === resolvedBaitKeys[0] ? 'ĐOÁN ĐÂY?' : 'HAY ĐÂY?'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
