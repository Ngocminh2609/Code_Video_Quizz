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
      {/* Primary Composition: Configured for Single Render & Interactive Studio Controls */}
      <Composition
        id="MainQuiz"
        component={QuizComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={quizVideoSchema}
        defaultProps={{
          quiz: defaultQuiz,
        }}
      />

      {/* Folder Registry: Configured for Batch Rendering Every Quiz from quizzes.json */}
      <Folder name="All-Quizzes">
        {quizzes.map((quiz) => (
          <Composition
            key={quiz.id}
            id={quiz.id}
            component={QuizComposition}
            durationInFrames={300}
            fps={30}
            width={1080}
            height={1920}
            schema={quizVideoSchema}
            defaultProps={{
              quiz,
            }}
          />
        ))}
      </Folder>
    </>
  );
};
