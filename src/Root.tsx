import React from 'react';
import { Composition, Folder } from 'remotion';
import './index.css';
import { QuizComposition } from './QuizComposition';
import { QuizItem, quizVideoSchema } from './types';
import rawQuizzes from './data/quizzes.json';
import { HolidayComposition } from './holidays/HolidayComposition';
import { holidayConfigSchema } from './holidays/types';

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

      {/* 🌸 Folder: Ngày Lễ Việt Nam (Chuyên làm các video ngày lễ lớn) */}
      <Folder name="Ngay-Le">
        <Composition
          id="Holiday-20-10"
          component={HolidayComposition}
          durationInFrames={360}
          fps={30}
          width={1080}
          height={1920}
          schema={holidayConfigSchema}
          defaultProps={{
            holidayName: '20/10 - Ngày Phụ Nữ Việt Nam',
            titleBadge: 'CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM',
            dateHighlight: '20 • 10',
            mainWish:
              'Chúc bạn luôn rạng rỡ, bình an trong tâm hồn và được yêu thương theo cách trọn vẹn nhất.',
            subWish: "Happy Vietnamese Women's Day ✨",
          }}
        />
      </Folder>

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
