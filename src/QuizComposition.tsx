import React from 'react';
import { Audio, staticFile, Sequence } from 'remotion';
import { QuizCompositionProps, resolveConfusingOptions, resolveWarningHook } from './types';
import { LANGUAGE_CONFIGS } from './utils/languageTheme';
import { getSoundForQuiz } from './utils/soundManager';
import { Background } from './components/Background';
import { HeaderHook } from './components/HeaderHook';
import { CodeCard } from './components/CodeCard';
import { CountdownBar } from './components/CountdownBar';
import { OptionsGrid } from './components/OptionsGrid';
import { EngagementBaitCTA } from './components/EngagementBaitCTA';
import { InDepthExplanationCard } from './components/InDepthExplanationCard';
import { Confetti } from './components/Confetti';

export const QuizComposition: React.FC<QuizCompositionProps> = ({
  quiz,
  displayMode = 'engagement-bait',
  hideCountdown = false,
  hideAnswer = false,
  warningHook,
  warningText,
}) => {
  const languageConfig = LANGUAGE_CONFIGS[quiz.language] || LANGUAGE_CONFIGS.python;

  // Resolve countdown, victory, and random danger warning sounds
  const { countdownSound, successSound, warningSound } = getSoundForQuiz(
    quiz.id,
    quiz.audioCountdown,
    quiz.audioSuccess,
    quiz.audioWarning
  );

  // Pure Vietnamese content & dynamic warning hook
  const hookTitle = quiz.hookTitleVi || quiz.hookTitle;
  const activeWarningHook =
    warningHook ||
    warningText ||
    resolveWarningHook({
      warningHook: quiz.warningHook,
      warningHookVi: quiz.warningHookVi,
      difficulty: quiz.difficulty,
      difficultyVi: quiz.difficultyVi,
    });

  const difficulty = quiz.difficultyVi || quiz.difficulty || 'CƠ BẢN';
  const category = quiz.categoryVi || quiz.category;
  const question = quiz.questionVi || quiz.question;
  const explanation = quiz.explanationVi || quiz.explanation;
  const inDepthExplanation = quiz.inDepthExplanationVi || quiz.inDepthExplanation || explanation;
  const inDepthPoints = quiz.inDepthPointsVi || quiz.inDepthPoints || [];

  // 2 đáp án gây lú nhất (confusingOptions hoặc baitOptions)
  const resolvedConfusing = resolveConfusingOptions(quiz);

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
      {/* 🔹 (1) ÂM THANH CÒI BÁO ĐỘNG KHẨN CẤP NGẪU NHIÊN (Frame 0 đến 45 = 1.5s đầu) */}
      {warningSound && (
        <Audio
          src={
            warningSound.file.startsWith('http')
              ? warningSound.file
              : staticFile(warningSound.file)
          }
          startFrom={0}
          endAt={45}
          volume={warningSound.volume}
        />
      )}

      {/* 🔹 (2) GIAI ĐOẠN 2: Countdown Tick-Tock (Frame 60 đến 180 = 120 frames / 4 giây) */}
      {!hideCountdown && countdownSound && (
        <Sequence from={60} durationInFrames={120} name={`Countdown Audio (${countdownSound.name})`}>
          <Audio
            src={staticFile(countdownSound.file)}
            volume={countdownSound.volume}
          />
        </Sequence>
      )}

      {/* 🔹 (3) GIAI ĐOẠN 3: Celebration Audio (Chỉ phát ở mode 'in-depth' khi show đáp án đúng) */}
      {displayMode === 'in-depth' && !hideAnswer && successSound && (
        <Sequence from={180} durationInFrames={150} name={`Celebration Audio (${successSound.name})`}>
          <Audio
            src={staticFile(successSound.file)}
            volume={successSound.volume}
          />
        </Sequence>
      )}

      {/* Dynamic Animated Cyberpunk Background with Audio Spectrum */}
      <Background languageConfig={languageConfig} />

      {/* Confetti Explosion (CHỈ nổ ở chế độ 'in-depth' khi hiển thị đáp án đúng tại Frame 180) */}
      {displayMode === 'in-depth' && !hideAnswer && <Confetti triggerFrame={180} />}

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
        {/* 🔹 (1) GIAI ĐOẠN 1: 0s - 2s (Frames 0 - 60) | Hook Cảnh Báo Đỏ
            Banner rung nảy bằng spring() với nội dung động theo độ khó (Easy, Medium, Hard, Extreme)
            Từ frame 36 đến 60 thu nhỏ dần neo lên header */}
        <HeaderHook
          hookTitle={hookTitle}
          warningHookText={activeWarningHook}
          difficulty={difficulty}
          category={category}
          languageConfig={languageConfig}
        />

        {/* 🔹 Khung Code: Xuất hiện mờ phía sau từ frame 0 để người xem quét trước đề bài,
            từ frame 36 đến 60 sáng rõ 100% khi banner neo lên header */}
        <CodeCard code={quiz.code} languageConfig={languageConfig} />

        {/* 🔹 (2) GIAI ĐOẠN 2: 2s - 6s (Frames 60 - 180) | Thanh tiến trình co dần 100% về 0% & Đồng hồ số */}
        {!hideCountdown && <CountdownBar startFrame={60} endFrame={180} />}

        {/* 🔹 (3) GIAI ĐOẠN 3: 4 Options Trắc Nghiệm:
            - 'engagement-bait': làm mờ các phương án hiển nhiên sai, giữ 2 đáp án gây lú (confusingOptions) nhấp nháy thăm dò.
            - 'in-depth': hiển thị đáp án đúng viền xanh sáng. */}
        <OptionsGrid
          question={question}
          options={quiz.options}
          correctAnswer={quiz.correctAnswer}
          baitOptions={resolvedConfusing}
          displayMode={displayMode}
          revealFrame={hideAnswer ? 999999 : 180}
        />

        {/* 🔹 (3) GIAI ĐOẠN 3: TÁCH LUỒNG RENDER DỰA THEO displayMode (TỪ FRAME 180 TRỞ ĐI) */}
        <div style={{ minHeight: 250, display: 'flex', alignItems: 'center' }}>
          {displayMode === 'engagement-bait' ? (
            // LỰA CHỌN A: 'engagement-bait' (Tuyệt đối không show đáp án, CTA tranh luận, loop liền mạch)
            <EngagementBaitCTA
              baitOptions={resolvedConfusing}
              triggerFrame={180}
            />
          ) : (
            // LỰA CHỌN B: 'in-depth' (Giải thích chi tiết cơ chế code trong 8-12s, CTA "Lưu lại để ôn tập 📌")
            <InDepthExplanationCard
              correctAnswer={quiz.correctAnswer}
              explanation={explanation}
              inDepthExplanation={inDepthExplanation}
              inDepthPoints={inDepthPoints}
              triggerFrame={180}
            />
          )}
        </div>
      </div>
    </div>
  );
};
