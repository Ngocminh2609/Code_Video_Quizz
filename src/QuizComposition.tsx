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

export const QuizComposition: React.FC<QuizCompositionProps> = ({ quiz }) => {
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
      {countdownSound && (
        <Sequence from={30} durationInFrames={180} name={`Countdown Audio (${countdownSound.name})`}>
          <Audio
            src={staticFile(countdownSound.file)}
            volume={countdownSound.volume}
          />
        </Sequence>
      )}

      {/* 2. Answer Reveal & Celebration Chime (Frame 210 to 300 = 90 frames / 3 seconds) */}
      {successSound && (
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
      <Confetti triggerFrame={210} />

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
        <CountdownBar startFrame={30} endFrame={210} />

        {/* 4. OptionsGrid: 4-Option Trắc Nghiệm Grid with Highlight State */}
        <OptionsGrid
          question={question}
          options={quiz.options}
          correctAnswer={quiz.correctAnswer}
          revealFrame={210}
        />

        {/* 5. ExplanationCard: Bottom Breakdown of Gotcha & Call to Action */}
        <div style={{ minHeight: 250 }}>
          <ExplanationCard
            correctAnswer={quiz.correctAnswer}
            explanation={explanation}
            triggerFrame={210}
          />
        </div>
      </div>
    </div>
  );
};
