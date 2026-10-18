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
        paddingTop: 70,
        paddingBottom: 50,
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
        {/* Top: Header Hook & Badges (Bilingual) */}
        <HeaderHook
          hookTitle={quiz.hookTitle}
          hookTitleVi={quiz.hookTitleVi}
          difficulty={quiz.difficulty}
          difficultyVi={quiz.difficultyVi}
          category={quiz.category}
          categoryVi={quiz.categoryVi}
          languageConfig={languageConfig}
        />

        {/* Upper-Middle: Sleek Code Terminal with Prism Highlighting */}
        <CodeWindow code={quiz.code} languageConfig={languageConfig} />

        {/* Center: Dynamic Countdown Timer (Bilingual) */}
        <CountdownTimer startFrame={30} endFrame={210} />

        {/* Lower-Middle: Question & Options Grid (Bilingual) */}
        <QuestionBox
          question={quiz.question}
          questionVi={quiz.questionVi}
          options={quiz.options}
          correctAnswer={quiz.correctAnswer}
          revealFrame={210}
        />

        {/* Bottom: Explanation Card (Bilingual EN + VI) */}
        <div style={{ minHeight: 250 }}>
          <ExplanationCard
            correctAnswer={quiz.correctAnswer}
            explanation={quiz.explanation}
            explanationVi={quiz.explanationVi}
            triggerFrame={210}
          />
        </div>
      </div>
    </div>
  );
};
