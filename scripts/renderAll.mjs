import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { generateAllAudio } from './generateAudio.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const quizzesPath = path.join(projectRoot, 'src', 'data', 'quizzes.json');
const outDir = path.join(projectRoot, 'out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(quizzesPath)) {
  console.error(`❌ Không tìm thấy file dữ liệu câu hỏi tại: ${quizzesPath}`);
  process.exit(1);
}

let quizzes = [];
try {
  quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));
} catch (parseErr) {
  console.error(`❌ Lỗi phân tích cú pháp JSON trong file quizzes.json:`, parseErr.message);
  process.exit(1);
}

if (!Array.isArray(quizzes) || quizzes.length === 0) {
  console.error('❌ File src/data/quizzes.json không chứa danh sách câu hỏi hợp lệ.');
  process.exit(1);
}

// 1. Kiểm tra sự tồn tại của đầy đủ 6 tệp âm thanh hiệu ứng
const REQUIRED_AUDIO_FILES = [
  path.join(projectRoot, 'public', 'audio', 'countdown', 'tick-classic.wav'),
  path.join(projectRoot, 'public', 'audio', 'countdown', 'tick-digital.wav'),
  path.join(projectRoot, 'public', 'audio', 'countdown', 'tick-tense.wav'),
  path.join(projectRoot, 'public', 'audio', 'success', 'bell-chime.wav'),
  path.join(projectRoot, 'public', 'audio', 'success', 'brass-fanfare.wav'),
  path.join(projectRoot, 'public', 'audio', 'success', 'arcade-levelup.wav'),
];

const isAudioMissing = REQUIRED_AUDIO_FILES.some((f) => !fs.existsSync(f));
if (isAudioMissing) {
  generateAllAudio();
}

// 2. Cấu hình danh mục âm thanh (đồng bộ với src/utils/soundManager.ts)
const COUNTDOWN_SOUNDS = [
  { id: 'classic-clock', name: 'Đồng Hồ Tích Tắc Cổ Điển', file: 'audio/countdown/tick-classic.wav', volume: 0.75 },
  { id: 'digital-beep', name: 'Cyberpunk Đếm Ngược Số', file: 'audio/countdown/tick-digital.wav', volume: 0.65 },
  { id: 'tense-heartbeat', name: 'Nhịp Tim Căng Thẳng Hồi Hộp', file: 'audio/countdown/tick-tense.wav', volume: 0.8 },
];

const SUCCESS_SOUNDS = [
  { id: 'crystal-chime', name: 'Chuông Ngân Pha Lê Ting', file: 'audio/success/bell-chime.wav', volume: 0.85 },
  { id: 'victory-fanfare', name: 'Kèn Fanfare Chiến Thắng', file: 'audio/success/brass-fanfare.wav', volume: 0.75 },
  { id: 'arcade-levelup', name: 'Game 8-Bit Level Up', file: 'audio/success/arcade-levelup.wav', volume: 0.7 },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getSoundForQuiz(quizId, overrideCountdown, overrideSuccess) {
  const hash = hashString(quizId || 'default');
  const cIdx = hash % COUNTDOWN_SOUNDS.length;
  const sIdx = (hash + 1) % SUCCESS_SOUNDS.length;
  const countdownSound = overrideCountdown
    ? COUNTDOWN_SOUNDS.find((s) => s.id === overrideCountdown || s.file === overrideCountdown) || COUNTDOWN_SOUNDS[cIdx]
    : COUNTDOWN_SOUNDS[cIdx];
  const successSound = overrideSuccess
    ? SUCCESS_SOUNDS.find((s) => s.id === overrideSuccess || s.file === overrideSuccess) || SUCCESS_SOUNDS[sIdx]
    : SUCCESS_SOUNDS[sIdx];
  return { countdownSound, successSound };
}

// Chuẩn hóa đường dẫn cho lệnh shell trên cả Windows, Linux và macOS
const toSafePath = (filePath) => filePath.replace(/\\/g, '/');

// 3. Xử lý tham số dòng lệnh CLI linh hoạt
const args = process.argv.slice(2);
const isFirstOnly = args.includes('--first') || args.includes('-1');
const isStillOnly = args.includes('--still-only') || args.includes('--stills');
const isVideoOnly = args.includes('--video-only');
const targetId = args.find((arg) => !arg.startsWith('-')) || null;

if (targetId) {
  const matched = quizzes.find((q) => q.id === targetId);
  if (!matched) {
    console.error(`❌ Không tìm thấy câu hỏi có ID "${targetId}".`);
    console.error(`📋 Danh sách ID có sẵn: ${quizzes.map((q) => q.id).join(', ')}`);
    process.exit(1);
  }
}

const quizzesToProcess = targetId
  ? quizzes.filter((q) => q.id === targetId)
  : isFirstOnly
    ? [quizzes[0]]
    : quizzes;

console.log(`🎬 Chuẩn bị xử lý ${quizzesToProcess.length} bộ video & hình ảnh...`);
if (isStillOnly) console.log('   ℹ️ Chế độ: Chỉ render ảnh chụp preview (Bỏ qua video MP4).');
if (isVideoOnly) console.log('   ℹ️ Chế độ: Chỉ render video MP4 (Bỏ qua ảnh chụp preview).');
console.log();

let successCount = 0;
let failCount = 0;

for (let i = 0; i < quizzesToProcess.length; i++) {
  const quiz = quizzesToProcess[i];
  const originalIdx = quizzes.findIndex((q) => q.id === quiz.id);
  const orderNumber = (originalIdx >= 0 ? originalIdx : i) + 1;
  const folderName = quiz.folderNameVi || `${String(orderNumber).padStart(2, '0')}_${quiz.id}`;
  const quizDir = path.join(outDir, folderName);

  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir, { recursive: true });
  }

  const videoPath = path.join(quizDir, 'video_hoan_chinh.mp4');
  const questionImgPath = path.join(quizDir, 'anh_cau_hoi.png');
  const countdownImgPath = path.join(quizDir, 'anh_dem_nguoc.png');
  const revealImgPath = path.join(quizDir, 'anh_cong_bo_dap_an.png');
  const metadataPath = path.join(quizDir, 'thong_tin_cau_do.json');

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`[${i + 1}/${quizzesToProcess.length}] 📁 Thư mục: out/${folderName}`);
  console.log(`   Tiêu đề EN: ${quiz.hookTitle}`);
  console.log(`   Tiêu đề VI: ${quiz.hookTitleVi || ''}`);
  console.log(`   Ngôn ngữ:   ${quiz.language.toUpperCase()}`);

  const { countdownSound, successSound } = getSoundForQuiz(quiz.id, quiz.audioCountdown, quiz.audioSuccess);
  console.log(`   ⏱️ Đếm ngược:  ${countdownSound.name} (${countdownSound.file}) [vol: ${countdownSound.volume}]`);
  console.log(`   🎉 Chúc mừng:   ${successSound.name} (${successSound.file}) [vol: ${successSound.volume}]`);

  try {
    // 1. Render Video MP4 (10s, 300 frames, 1080x1920, Lossless PNG frame buffer, CRF 14)
    if (!isStillOnly) {
      console.log(`   🎥 Đang render video độ nét cao: video_hoan_chinh.mp4...`);
      const cmdVideo = `npx remotion render src/index.ts "${quiz.id}" "${toSafePath(videoPath)}" --image-format=png --crf=14 --pixel-format=yuv420p --concurrency=4`;
      execSync(cmdVideo, { cwd: projectRoot, stdio: 'inherit' });
    }

    // 2. Render các ảnh chụp tĩnh (Still Images)
    if (!isVideoOnly) {
      // 2a. Ảnh câu hỏi thuần túy (Không đếm ngược & không công bố đáp án)
      console.log(`   📸 Đang render ảnh câu hỏi: anh_cau_hoi.png (không đếm ngược & không đáp án)...`);
      const cmdQuestion = `npx remotion still src/index.ts "question-${quiz.id}" "${toSafePath(questionImgPath)}" --image-format=png --frame=90`;
      execSync(cmdQuestion, { cwd: projectRoot, stdio: 'inherit' });

      // 2b. Ảnh đếm ngược (đang làm bài, frame 100)
      console.log(`   📸 Đang render ảnh đếm ngược: anh_dem_nguoc.png (frame 100)...`);
      const cmdCountdown = `npx remotion still src/index.ts "${quiz.id}" "${toSafePath(countdownImgPath)}" --image-format=png --frame=100`;
      execSync(cmdCountdown, { cwd: projectRoot, stdio: 'inherit' });

      // 2c. Ảnh công bố đáp án & thẻ giải thích (frame 240)
      console.log(`   📸 Đang render ảnh công bố đáp án: anh_cong_bo_dap_an.png (frame 240)...`);
      const cmdReveal = `npx remotion still src/index.ts "${quiz.id}" "${toSafePath(revealImgPath)}" --image-format=png --frame=240`;
      execSync(cmdReveal, { cwd: projectRoot, stdio: 'inherit' });
    }

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
          soundEffects: {
            countdown: countdownSound,
            celebration: successSound,
          },
          files: {
            video: isStillOnly ? null : 'video_hoan_chinh.mp4',
            questionImage: 'anh_cau_hoi.png',
            countdownImage: 'anh_dem_nguoc.png',
            revealImage: 'anh_cong_bo_dap_an.png',
          },
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
    successCount++;
  } catch (err) {
    failCount++;
    console.error(`   ❌ Lỗi khi xử lý ${quiz.id}:`, err.message);
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🏁 Tổng kết hoàn tất: ${quizzesToProcess.length} bài thi.`);
console.log(`   ✅ Thành công: ${successCount}`);
if (failCount > 0) {
  console.log(`   ❌ Thất bại:   ${failCount}`);
  process.exit(1);
} else {
  console.log('🎉 TẤT CẢ TỆP ĐÃ ĐƯỢC XUẤT VÀ PHÂN LOẠI VÀO TỪNG THƯ MỤC TRONG out/ !');
}
