import React from 'react';
import { QuizItem } from '../types/quiz';
import { LANGUAGE_CONFIGS } from '../utils/languageTheme';
import { Background } from './Background';
import { HeaderHook } from './HeaderHook';
import { CodeWindow } from './CodeWindow';
import { CountdownTimer } from './CountdownTimer';
import { QuestionBox } from './QuestionBox';
import { ExplanationCard } from './ExplanationCard';
import { Confetti } from './Confetti';

export interface QuizVideoProps extends Record<string, unknown> {
  quiz: QuizItem;
}

export const QuizVideo: React.FC<QuizVideoProps> = ({ quiz }) => {
  const languageConfig = LANGUAGE_CONFIGS[quiz.language] || LANGUAGE_CONFIGS.python;

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
        paddingTop: 80,
        paddingBottom: 60,
      }}
    >
      {/* Dynamic Animated Background */}
      <Background languageConfig={languageConfig} />

      {/* Confetti Explosion on Answer Reveal (Frame 210+) */}
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
        {/* Top: Header Hook & Badges */}
        <HeaderHook
          hookTitle={quiz.hookTitle}
          difficulty={quiz.difficulty}
          category={quiz.category}
          languageConfig={languageConfig}
        />

        {/* Upper-Middle: Sleek Code Terminal with Prism Highlighting */}
        <CodeWindow code={quiz.code} languageConfig={languageConfig} />

        {/* Center: Dynamic Countdown Timer */}
        <CountdownTimer startFrame={30} endFrame={210} />

        {/* Lower-Middle: Question & Options Grid */}
        <QuestionBox
          question={quiz.question}
          options={quiz.options}
          correctAnswer={quiz.correctAnswer}
          revealFrame={210}
        />

        {/* Bottom: Explanation Card (Appears at frame 210) */}
        <div style={{ minHeight: 250 }}>
          <ExplanationCard
            correctAnswer={quiz.correctAnswer}
            explanation={quiz.explanation}
            triggerFrame={210}
          />
        </div>
      </div>
    </div>
  );
};
