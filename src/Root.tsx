import React from 'react';
import { Composition, Folder } from 'remotion';
import './index.css';
import { QuizComposition } from './QuizComposition';
import { QuizItem, quizVideoSchema } from './types';
import rawQuizzes from './data/quizzes.json';

const quizzes = rawQuizzes as QuizItem[];
const defaultQuiz: QuizItem = quizzes[0];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🔹 Primary Composition: Lựa chọn A: Engagement-Bait (Kéo Comment Cực Đại - 9s / 270 frames) */}
      <Composition
        id="MainQuiz"
        component={QuizComposition}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        schema={quizVideoSchema}
        defaultProps={{
          quiz: defaultQuiz,
          displayMode: 'engagement-bait',
        }}
      />

      {/* 🔹 Primary Composition: Lựa chọn B: In-Depth (Kéo Lượt Lưu & Share - 16s / 480 frames) */}
      <Composition
        id="MainQuiz-InDepth"
        component={QuizComposition}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
        schema={quizVideoSchema}
        defaultProps={{
          quiz: defaultQuiz,
          displayMode: 'in-depth',
        }}
      />

      {/* Primary Question Still: Clean Poster Preview in Remotion Studio */}
      <Composition
        id="MainQuestionStill"
        component={QuizComposition}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        schema={quizVideoSchema}
        defaultProps={{
          quiz: defaultQuiz,
          displayMode: 'engagement-bait',
          hideCountdown: true,
          hideAnswer: true,
        }}
      />

      {/* Folder Registry: Quizzes mặc định (Engagement-Bait - 9s) */}
      <Folder name="All-Quizzes">
        {quizzes.map((quiz) => (
          <Composition
            key={quiz.id}
            id={quiz.id}
            component={QuizComposition}
            durationInFrames={quiz.displayMode === 'in-depth' ? 480 : 270}
            fps={30}
            width={1080}
            height={1920}
            schema={quizVideoSchema}
            defaultProps={{
              quiz,
              displayMode: quiz.displayMode || 'engagement-bait',
            }}
          />
        ))}
      </Folder>

      {/* Folder Registry: Quizzes In-Depth (Giải thích chuyên sâu - 16s) */}
      <Folder name="All-Quizzes-InDepth">
        {quizzes.map((quiz) => (
          <Composition
            key={`indepth-${quiz.id}`}
            id={`indepth-${quiz.id}`}
            component={QuizComposition}
            durationInFrames={480}
            fps={30}
            width={1080}
            height={1920}
            schema={quizVideoSchema}
            defaultProps={{
              quiz,
              displayMode: 'in-depth',
            }}
          />
        ))}
      </Folder>

      {/* Folder Registry: Clean Question Stills (No countdown bar & no answer reveal) */}
      <Folder name="Question-Stills">
        {quizzes.map((quiz) => (
          <Composition
            key={`question-${quiz.id}`}
            id={`question-${quiz.id}`}
            component={QuizComposition}
            durationInFrames={270}
            fps={30}
            width={1080}
            height={1920}
            schema={quizVideoSchema}
            defaultProps={{
              quiz,
              displayMode: 'engagement-bait',
              hideCountdown: true,
              hideAnswer: true,
            }}
          />
        ))}
      </Folder>
    </>
  );
};
