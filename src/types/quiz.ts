import { z } from 'zod';

export type Language = 'python' | 'javascript' | 'cpp' | 'java';

export const quizOptionSchema = z.object({
  key: z.enum(['A', 'B', 'C', 'D']),
  text: z.string(),
});

export const quizItemSchema = z.object({
  id: z.string(),
  hookTitle: z.string(),
  language: z.enum(['python', 'javascript', 'cpp', 'java']),
  code: z.string(),
  question: z.string(),
  options: z.array(quizOptionSchema),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Extreme']).optional(),
  category: z.string().optional(),
});

export const quizVideoSchema = z.object({
  quiz: quizItemSchema,
});

export type QuizOption = z.infer<typeof quizOptionSchema>;
export type QuizItem = z.infer<typeof quizItemSchema>;
export type QuizVideoSchema = typeof quizVideoSchema;
