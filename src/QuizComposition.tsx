import React from 'react';
import { Audio, staticFile, Sequence } from 'remotion';
import { QuizCompositionProps } from './types';
import { LANGUAGE_CONFIGS } from './utils/languageTheme';
import { getSoundForQuiz } from './utils/soundManager';
import { Background } from './components/Background';
import { HeaderHook } from './components/HeaderHook';
import { CodeCard } from './components/CodeCard';
import { CountdownBar } from './components/CountdownBar';
import { OptionsGrid } from './components/OptionsGrid';
import { ExplanationCard } from './components/ExplanationCard';
import { Confetti } from './components/Confetti';

export const QuizComposition: React.FC<QuizCompositionProps> = ({
  quiz,
  hideCountdown = false,
  hideAnswer = false,
}) => {
  const languageConfig = LANGUAGE_CONFIGS[quiz.language] || LANGUAGE_CONFIGS.python;

  // Resolve randomized / assigned sound effects for this specific quiz
  const { countdownSound, successSound } = getSoundForQuiz(
    quiz.id,
    quiz.audioCountdown,
    quiz.audioSuccess
  );

  // Use pure Vietnamese text throughout the video
  const hookTitle = quiz.hookTitleVi || quiz.hookTitle;
  const difficulty = quiz.difficultyVi || quiz.difficulty || 'CƠ BẢN';
  const category = quiz.categoryVi || quiz.category;
  const question = quiz.questionVi || quiz.question;
  const explanation = quiz.explanationVi || quiz.explanation;

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        paddingTop: 65,
        paddingBottom: 45,
      }}
    >
      {/* 1. Countdown Tick-Tock (Frame 30 to 210 = 180 frames / 6 seconds) */}
      {!hideCountdown && countdownSound && (
        <Sequence from={30} durationInFrames={180} name={`Countdown Audio (${countdownSound.name})`}>
          <Audio
            src={staticFile(countdownSound.file)}
            volume={countdownSound.volume}
          />
        </Sequence>
      )}

      {/* 2. Answer Reveal & Celebration Chime (Frame 210 to 300 = 90 frames / 3 seconds) */}
      {!hideAnswer && successSound && (
        <Sequence from={210} durationInFrames={90} name={`Celebration Audio (${successSound.name})`}>
          <Audio
            src={staticFile(successSound.file)}
            volume={successSound.volume}
          />
        </Sequence>
      )}
      {/* Dynamic Animated Cyberpunk Background with Audio Spectrum */}
      <Background languageConfig={languageConfig} />

      {/* Confetti Explosion Triggered on Answer Reveal (Frame 210+) */}
      {!hideAnswer && <Confetti triggerFrame={210} />}

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        {/* 1. Header Hook: Badge, Pure Vietnamese Hook Title & Category */}
        <HeaderHook
          hookTitle={hookTitle}
          difficulty={difficulty}
          category={category}
          languageConfig={languageConfig}
        />

        {/* 2. CodeCard: macOS Window Header with Syntax Highlighting */}
        <CodeCard code={quiz.code} languageConfig={languageConfig} />

        {/* 3. CountdownBar: Dynamic Linear Countdown Bar with Numeric Timer */}
        {!hideCountdown && <CountdownBar startFrame={30} endFrame={210} />}

        {/* 4. OptionsGrid: 4-Option Trắc Nghiệm Grid with Highlight State */}
        <OptionsGrid
          question={question}
          options={quiz.options}
          correctAnswer={quiz.correctAnswer}
          revealFrame={hideAnswer ? 999999 : 210}
        />

        {/* 5. Bottom Card: Either Explanation breakdown or Social Challenge CTA */}
        <div style={{ minHeight: 250, display: 'flex', alignItems: 'center' }}>
          {!hideAnswer ? (
            <ExplanationCard
              correctAnswer={quiz.correctAnswer}
              explanation={explanation}
              triggerFrame={210}
            />
          ) : (
            <div
              style={{
                width: '92%',
                margin: '0 auto',
                padding: '24px 28px',
                borderRadius: 22,
                backgroundColor: 'rgba(15, 23, 42, 0.82)',
                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                boxShadow:
                  '0 16px 36px rgba(0, 0, 0, 0.55), 0 0 25px rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <span style={{ fontSize: 38 }}>💬</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span
                    style={{
                      fontSize: 27,
                      fontWeight: 900,
                      color: '#f8fafc',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ĐÁP ÁN CỦA BẠN LÀ GÌ?
                  </span>
                  <span style={{ fontSize: 21, fontWeight: 700, color: '#38bdf8' }}>
                    Hãy để lại câu trả lời [A, B, C hay D] dưới phần bình luận! 👇
                  </span>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 20,
                  padding: '10px 22px',
                  borderRadius: 14,
                  boxShadow: '0 0 16px rgba(2, 132, 199, 0.6)',
                  flexShrink: 0,
                }}
              >
                THỬ THÁCH
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
