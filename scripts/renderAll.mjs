import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const quizzesPath = path.join(projectRoot, 'src', 'data', 'quizzes.json');
const outDir = path.join(projectRoot, 'out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

console.log(`🎬 Found ${quizzes.length} quizzes to render...\n`);

for (let i = 0; i < quizzes.length; i++) {
  const quiz = quizzes[i];
  const outPath = path.join(outDir, `${quiz.id}.mp4`);
  console.log(`[${i + 1}/${quizzes.length}] 🚀 Rendering "${quiz.id}" (${quiz.language})...`);

  const cmd = `npx remotion render src/index.ts "${quiz.id}" "${outPath}" --concurrency=4`;
  try {
    execSync(cmd, { cwd: projectRoot, stdio: 'inherit' });
    console.log(`✅ Successfully generated: ${outPath}\n`);
  } catch (err) {
    console.error(`❌ Failed to render ${quiz.id}:`, err.message);
  }
}

console.log('🎉 All quiz videos successfully generated in the out/ directory!');
