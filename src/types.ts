import { z } from 'zod';

export type Language = 'python' | 'javascript' | 'cpp' | 'java';
export type DisplayMode = 'engagement-bait' | 'in-depth';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Extreme';
export type TargetPlatform = 'Facebook' | 'Tiktok';

export const DIFFICULTY_WARNING_HOOKS: Record<string, string> = {
  Easy: '⚠️ 90% NGƯỜI MỚI HỌC SẼ CHỌN SAI CÂU NÀY!',
  Medium: '⚠️ CÂU HỎI PHỎNG VẤN ĐÁNH TRƯỢT 70% CANDIDATE!',
  Hard: '⚠️ 90% SENIOR DEV SẼ TRẢ LỜI SAI CÂU NÀY!',
  Extreme: '⚠️ 99% SẼ ĐOÁN SAI KẾT QUẢ IN RA!',
};

export const quizOptionSchema = z.object({
  key: z.enum(['A', 'B', 'C', 'D']),
  text: z.string(),
  textVi: z.string().optional(),
});

export const quizItemSchema = z.object({
  id: z.string(),
  folderNameVi: z.string().optional(),
  hookTitle: z.string(),
  hookTitleVi: z.string().optional(),
  warningHook: z.string().optional(), // Cảnh báo động theo độ khó hoặc tùy chỉnh
  warningHookVi: z.string().optional(),
  language: z.enum(['python', 'javascript', 'cpp', 'java']),
  code: z.string(),
  question: z.string(),
  questionVi: z.string().optional(),
  options: z.array(quizOptionSchema),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  confusingOptions: z.array(z.enum(['A', 'B', 'C', 'D'])).optional(), // 2 options gây lú nhất (VD: ['A', 'B'])
  baitOptions: z.array(z.enum(['A', 'B', 'C', 'D'])).optional(), // Alias tương thích ngược
  explanation: z.string(),
  explanationVi: z.string().optional(),
  inDepthExplanation: z.string().optional(), // Giải thích cơ chế under the hood
  inDepthExplanationVi: z.string().optional(),
  inDepthPoints: z.array(z.string()).optional(),
  inDepthPointsVi: z.array(z.string()).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Extreme']).or(z.string()).optional(),
  difficultyVi: z.string().optional(),
  category: z.string().optional(),
  categoryVi: z.string().optional(),
  audioCountdown: z.string().optional(),
  audioSuccess: z.string().optional(),
  audioWarning: z.string().optional(),
  displayMode: z.enum(['engagement-bait', 'in-depth']).optional(),
  platform: z.enum(['Facebook', 'Tiktok', 'facebook', 'tiktok']).optional(),
});

export const quizVideoSchema = z.object({
  quiz: quizItemSchema,
  displayMode: z.enum(['engagement-bait', 'in-depth']).optional(),
  hideCountdown: z.boolean().optional(),
  hideAnswer: z.boolean().optional(),
  warningHook: z.string().optional(),
  warningText: z.string().optional(),
});

export type QuizOption = z.infer<typeof quizOptionSchema>;
export type QuizItem = z.infer<typeof quizItemSchema>;
export type QuizVideoSchema = typeof quizVideoSchema;

export interface QuizCompositionProps extends Record<string, unknown> {
  quiz: QuizItem;
  displayMode?: DisplayMode;
  hideCountdown?: boolean;
  hideAnswer?: boolean;
  warningHook?: string;
  warningText?: string;
}

/**
 * Trả về nội dung hook cảnh báo đỏ dựa theo độ khó hoặc nội dung cấu hình riêng
 */
export function resolveWarningHook(quiz: {
  warningHook?: string;
  warningHookVi?: string;
  difficulty?: string;
  difficultyVi?: string;
}): string {
  if (quiz.warningHook) return quiz.warningHook;
  if (quiz.warningHookVi) return quiz.warningHookVi;

  const diff = quiz.difficulty || 'Easy';
  if (DIFFICULTY_WARNING_HOOKS[diff]) {
    return DIFFICULTY_WARNING_HOOKS[diff];
  }

  // Khớp với chữ tiếng Việt nếu có
  const lowerDiff = diff.toLowerCase();
  if (lowerDiff.includes('cơ bản') || lowerDiff.includes('dễ') || lowerDiff.includes('easy')) {
    return DIFFICULTY_WARNING_HOOKS.Easy;
  }
  if (lowerDiff.includes('vừa') || lowerDiff.includes('trung bình') || lowerDiff.includes('medium')) {
    return DIFFICULTY_WARNING_HOOKS.Medium;
  }
  if (lowerDiff.includes('khó') || lowerDiff.includes('hard')) {
    return DIFFICULTY_WARNING_HOOKS.Hard;
  }
  if (lowerDiff.includes('cực khó') || lowerDiff.includes('extreme')) {
    return DIFFICULTY_WARNING_HOOKS.Extreme;
  }

  return '⚠️ 90% DEVELOPER LÂU NĂM SẼ TRẢ LỜI SAI CÂU NÀY!';
}

/**
 * Lấy ra 2 đáp án gây lú nhất (confusingOptions hoặc baitOptions hoặc tự suy luận)
 */
export function resolveConfusingOptions(quiz: {
  confusingOptions?: Array<'A' | 'B' | 'C' | 'D'>;
  baitOptions?: Array<'A' | 'B' | 'C' | 'D'>;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  options: QuizOption[];
}): Array<'A' | 'B' | 'C' | 'D'> {
  if (quiz.confusingOptions && quiz.confusingOptions.length >= 2) {
    return quiz.confusingOptions.slice(0, 2);
  }
  if (quiz.baitOptions && quiz.baitOptions.length >= 2) {
    return quiz.baitOptions.slice(0, 2);
  }
  const otherKeys = quiz.options
    .map((o) => o.key)
    .filter((k) => k !== quiz.correctAnswer);
  const candidate = otherKeys[0] || 'A';
  return [quiz.correctAnswer, candidate].sort();
}
