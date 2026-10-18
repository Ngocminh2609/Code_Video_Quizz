import { z } from 'zod';

export type Language = 'python' | 'javascript' | 'cpp' | 'java';

export const quizOptionSchema = z.object({
  key: z.enum(['A', 'B', 'C', 'D']),
  text: z.string(),
  textVi: z.string().optional(),
});

export const quizItemSchema = z.object({
  id: z.string(),
  folderNameVi: z.string().optional(), // Tên thư mục tiếng Việt chuẩn hóa
  hookTitle: z.string(), // English: "99% Miss This Python Logic!"
  hookTitleVi: z.string().optional(), // Tiếng Việt: "99% Dev Mắc Lỗi Logic Này!"
  language: z.enum(['python', 'javascript', 'cpp', 'java']),
  code: z.string(),
  question: z.string(), // English: "What will be printed?"
  questionVi: z.string().optional(), // Tiếng Việt: "Kết quả in ra là gì?"
  options: z.array(quizOptionSchema),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string(), // English explanation
  explanationVi: z.string().optional(), // Tiếng Việt giải thích chi tiết
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Extreme']).optional(),
  difficultyVi: z.string().optional(), // "Dễ" | "Vừa" | "Khó" | "Cực Khó"
  category: z.string().optional(),
  categoryVi: z.string().optional(),
});

export const quizVideoSchema = z.object({
  quiz: quizItemSchema,
});

export type QuizOption = z.infer<typeof quizOptionSchema>;
export type QuizItem = z.infer<typeof quizItemSchema>;
export type QuizVideoSchema = typeof quizVideoSchema;
