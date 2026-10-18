# ⚡ Dynamic Code Quiz Video Generator (Remotion + React)

A production-ready Remotion project built with React, TypeScript, TailwindCSS, and `prism-react-renderer` that automatically generates high-converting, viral programming quiz videos for **TikTok, Instagram Reels, and YouTube Shorts** (1080x1920 vertical format).

> 📖 *English Documentation | [**Bản Tiếng Việt (Vietnamese Guide)**](README_VI.md)*

---

## 🚀 Key Specifications

- **Canvas Resolution**: 1080 x 1920 (9:16 vertical ratio).
- **Frame Rate**: 30 FPS.
- **Duration**: 10 seconds total (300 frames).
- **Code Syntax Highlighting**: Powered by `prism-react-renderer` with Dracula / dark theme and language extensions (Python, JavaScript, C++, Java).
- **Data-Driven**: Read structured quiz items from `src/data/quizzes.json`.
- **Interactive Remotion Studio**: Full Zod schema validation allowing real-time prop editing and instant preview.
- **Deterministic Animations**: Built 100% on Remotion springs and interpolations for stutter-free, flicker-free rendering.

---

## ⏱️ Video Pacing & Storyboard (10s / 300 Frames)

| Timing | Frames | Phase | Visual Highlights |
|---|---|---|---|
| **0.0s – 1.0s** | 0 – 30 | **Hook & Intro** | Animated pop-in badge (`🔥 SENIOR DEV TRAP`), bold curiosity title, language pill badge (`Python 3.12`, `ES2024`, `C++20`, `Java 21`), and code terminal entrance. |
| **1.0s – 7.0s** | 30 – 210 | **Suspense & Thinking** | 4 staggered options (A, B, C, D) appear. Radial countdown timer drains smoothly with color shifts (Cyan ➔ Amber ➔ Urgent Rose) with heartbeat pulsing. |
| **7.0s – 10.0s** | 210 – 300 | **Reveal & Explanation** | "Time's Up!" alert. Correct answer expands with an electric emerald glow and checkmark (`WIN`). Wrong answers dim out. A deterministic particle confetti blast erupts, and the bottom explanation card slides up with the exact gotcha breakdown. |

---

## 📂 Project Structure

```
Code_Video_Quizz/
├── public/                 # Static assets
├── scripts/
│   └── renderAll.mjs       # Automated batch renderer for all quizzes
├── src/
│   ├── components/
│   │   ├── Background.tsx       # Futuristic animated dark grid & audio visualizer
│   │   ├── CodeWindow.tsx       # Mac-style terminal with Prism syntax highlighting
│   │   ├── Confetti.tsx         # Frame-based physics confetti celebration
│   │   ├── CountdownTimer.tsx   # SVG radial countdown ring & urgency animations
│   │   ├── ExplanationCard.tsx  # Bottom gotcha explanation card & CTA
│   │   ├── HeaderHook.tsx       # High-impact hook title & language badges
│   │   ├── QuestionBox.tsx      # Staggered options grid & correct answer highlight
│   │   └── QuizVideo.tsx        # Master composition layout
│   ├── data/
│   │   └── quizzes.json         # Quiz database (Python, JS, C++, Java)
│   ├── types/
│   │   └── quiz.ts              # TypeScript interfaces & Zod schemas
│   ├── utils/
│   │   ├── languageTheme.ts     # Brand colors, icons, filenames per language
│   │   └── prismSetup.ts        # Prism syntax grammar registration
│   ├── Composition.tsx          # Composition entry
│   ├── index.css                # Typography (Outfit, JetBrains Mono) & styling
│   ├── index.ts                 # Remotion root register
│   └── Root.tsx                 # Compositions & All-Quizzes folder registry
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

---

## 🛠️ Getting Started

### 1. Launch Remotion Studio (Preview & Edit in Browser)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view:
- **`MainQuiz`**: The primary composition with interactive schema controls.
- **`All-Quizzes` Folder**: Previews for every quiz defined in `src/data/quizzes.json`.

### 2. Render Single Quiz Video to MP4
```bash
npm run render
```
Renders `MainQuiz` directly to `out/quiz.mp4`.

### 3. Batch Render All Quizzes
```bash
npm run render:all
```
Iterates through all quizzes in `src/data/quizzes.json` and renders each to `out/<quiz-id>.mp4`.

### 4. Render a Still Frame Preview
```bash
npm run render:still
```
Exports a high-resolution 1080x1920 PNG still of frame 240 (answer reveal phase).

### 5. Run Type Checks & Lint
```bash
npm run lint
```

---

## 📝 Adding New Quizzes (`src/data/quizzes.json`)

To add a new quiz, simply append an entry to `src/data/quizzes.json`:

```json
{
  "id": "python-mutable-default",
  "hookTitle": "99% Miss This Python Logic!",
  "language": "python",
  "code": "def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))",
  "question": "What will be printed?",
  "options": [
    { "key": "A", "text": "[1] then [2]" },
    { "key": "B", "text": "[1] then [1, 2]" },
    { "key": "C", "text": "[1] then [2, 1]" },
    { "key": "D", "text": "TypeError" }
  ],
  "correctAnswer": "B",
  "explanation": "Default arguments are evaluated ONCE at function definition time! Subsequent calls share the exact same list instance in memory.",
  "difficulty": "Medium",
  "category": "Scope & Mutability"
}
```

### Supported Languages:
- `"python"`: Cyan/Amber palette, `main.py`, 🐍 Python badge
- `"javascript"`: Yellow/Amber palette, `index.js`, ⚡ JavaScript badge
- `"cpp"`: Blue/Indigo palette, `main.cpp`, ⚙️ C++ badge
- `"java"`: Orange/Rose palette, `Main.java`, ☕ Java badge
