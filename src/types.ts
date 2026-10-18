import { z } from 'zod';

export type Language = 'python' | 'javascript' | 'cpp' | 'java';

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
  language: z.enum(['python', 'javascript', 'cpp', 'java']),
  code: z.string(),
  question: z.string(),
  questionVi: z.string().optional(),
  options: z.array(quizOptionSchema),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string(),
  explanationVi: z.string().optional(),
  difficulty: z.string().optional(),
  difficultyVi: z.string().optional(),
  category: z.string().optional(),
  categoryVi: z.string().optional(),
});

export const quizVideoSchema = z.object({
  quiz: quizItemSchema,
});

export type QuizOption = z.infer<typeof quizOptionSchema>;
export type QuizItem = z.infer<typeof quizItemSchema>;
export type QuizVideoSchema = typeof quizVideoSchema;

export interface QuizCompositionProps extends Record<string, unknown> {
  quiz: QuizItem;
}
