import { Language } from '../types/quiz';

export interface LanguageConfig {
  name: string;
  badge: string;
  tag: string;
  filename: string;
  prismLang: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  gradient: string;
  bgGlow: string;
}

export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  python: {
    name: 'Python',
    badge: '🐍 Python 3.12',
    tag: 'PYTHON',
    filename: 'main.py',
    prismLang: 'python',
    primaryColor: '#38bdf8',
    secondaryColor: '#facc15',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    gradient: 'from-sky-400 to-amber-300',
    bgGlow: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
  },
  javascript: {
    name: 'JavaScript',
    badge: '⚡ JavaScript ES2024',
    tag: 'JS',
    filename: 'index.js',
    prismLang: 'javascript',
    primaryColor: '#facc15',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(250, 204, 21, 0.5)',
    gradient: 'from-yellow-300 to-amber-500',
    bgGlow: 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)',
  },
  cpp: {
    name: 'C++',
    badge: '⚙️ C++20',
    tag: 'C++',
    filename: 'main.cpp',
    prismLang: 'cpp',
    primaryColor: '#60a5fa',
    secondaryColor: '#3b82f6',
    glowColor: 'rgba(96, 165, 250, 0.5)',
    gradient: 'from-blue-400 to-indigo-500',
    bgGlow: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
  },
  java: {
    name: 'Java',
    badge: '☕ Java 21',
    tag: 'JAVA',
    filename: 'Main.java',
    prismLang: 'java',
    primaryColor: '#fb923c',
    secondaryColor: '#ef4444',
    glowColor: 'rgba(251, 146, 60, 0.5)',
    gradient: 'from-orange-400 to-rose-500',
    bgGlow: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
  },
};
