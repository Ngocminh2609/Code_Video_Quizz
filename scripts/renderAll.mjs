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

// Check if a specific quiz id or limit is passed
const args = process.argv.slice(2);
const targetId = args[0] && !args[0].startsWith('--') ? args[0] : null;
const isFirstOnly = args.includes('--first') || args.includes('-1');

const quizzesToProcess = targetId
  ? quizzes.filter((q) => q.id === targetId)
  : isFirstOnly
    ? [quizzes[0]]
    : quizzes;

console.log(`🎬 Bắt đầu xuất ${quizzesToProcess.length} bộ video & hình ảnh vào từng thư mục riêng biệt...\n`);

for (let i = 0; i < quizzesToProcess.length; i++) {
  const quiz = quizzesToProcess[i];
  const folderName = quiz.folderNameVi || `${String(i + 1).padStart(2, '0')}_${quiz.id}`;
  const quizDir = path.join(outDir, folderName);

  // Tạo thư mục riêng tiếng Việt cho từng quiz
  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir, { recursive: true });
  }

  const videoPath = path.join(quizDir, 'video_hoan_chinh.mp4');
  const countdownImgPath = path.join(quizDir, 'anh_dem_nguoc.png');
  const revealImgPath = path.join(quizDir, 'anh_cong_bo_dap_an.png');
  const metadataPath = path.join(quizDir, 'thong_tin_cau_do.json');

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`[${i + 1}/${quizzesToProcess.length}] 📁 Thư mục: out/${folderName}`);
  console.log(`   Tiêu đề EN: ${quiz.hookTitle}`);
  console.log(`   Tiêu đề VI: ${quiz.hookTitleVi || ''}`);
  console.log(`   Ngôn ngữ:   ${quiz.language.toUpperCase()}`);

  try {
    // 1. Render Video MP4 (10s, 300 frames, 1080x1920)
    console.log(`   🎥 Đang render video: video_hoan_chinh.mp4...`);
    const cmdVideo = `npx remotion render src/index.ts "${quiz.id}" "${videoPath}" --concurrency=4`;
    execSync(cmdVideo, { cwd: projectRoot, stdio: 'inherit' });

    // 2. Render ảnh đếm ngược (frame 100)
    console.log(`   📸 Đang render ảnh đếm ngược: anh_dem_nguoc.png (frame 100)...`);
    const cmdCountdown = `npx remotion still src/index.ts "${quiz.id}" "${countdownImgPath}" --frame=100`;
    execSync(cmdCountdown, { cwd: projectRoot, stdio: 'inherit' });

    // 3. Render ảnh công bố đáp án & thẻ giải thích (frame 240)
    console.log(`   📸 Đang render ảnh công bố đáp án: anh_cong_bo_dap_an.png (frame 240)...`);
    const cmdReveal = `npx remotion still src/index.ts "${quiz.id}" "${revealImgPath}" --frame=240`;
    execSync(cmdReveal, { cwd: projectRoot, stdio: 'inherit' });

    // 4. Lưu metadata thông tin câu đố JSON
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          id: quiz.id,
          folderNameVi: folderName,
          language: quiz.language,
          hookTitleEn: quiz.hookTitle,
          hookTitleVi: quiz.hookTitleVi,
          questionEn: quiz.question,
          questionVi: quiz.questionVi,
          code: quiz.code,
          options: quiz.options,
          correctAnswer: quiz.correctAnswer,
          explanationEn: quiz.explanation,
          explanationVi: quiz.explanationVi,
          renderedAt: new Date().toISOString(),
          resolution: '1080x1920',
          fps: 30,
          durationFrames: 300,
          durationSeconds: 10,
        },
        null,
        2
      ),
      'utf-8'
    );

    console.log(`   ✅ Hoàn thành xuất sắc: ${folderName}\n`);
  } catch (err) {
    console.error(`   ❌ Lỗi khi xử lý ${quiz.id}:`, err.message);
  }
}

console.log('🎉 TẤT CẢ VIDEO VÀ HÌNH ẢNH ĐÃ ĐƯỢC XUẤT VÀ PHÂN LOẠI VÀO TỪNG THƯ MỤC TRONG out/ !');
