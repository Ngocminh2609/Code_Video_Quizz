import React from 'react';
import { Composition, Folder } from 'remotion';
import './index.css';
import { QuizVideo } from './components/QuizVideo';
import { QuizItem, quizVideoSchema } from './types/quiz';
import rawQuizzes from './data/quizzes.json';

const quizzes = rawQuizzes as QuizItem[];
const defaultQuiz: QuizItem = quizzes[0];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary Composition: Dynamic props & Remotion Studio Schema */}
      <Composition
        id="MainQuiz"
        component={QuizVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={quizVideoSchema}
        defaultProps={{
          quiz: defaultQuiz,
        }}
      />

      {/* Folder containing individual compositions for every quiz in data/quizzes.json */}
      <Folder name="All-Quizzes">
        {quizzes.map((quiz) => (
          <Composition
            key={quiz.id}
            id={quiz.id}
            component={QuizVideo}
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
