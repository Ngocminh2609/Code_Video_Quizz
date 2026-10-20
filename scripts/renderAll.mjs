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

const WARNING_SOUNDS = [
  { id: 'warning-siren', name: 'Còi Hú Khẩn Cấp Siren', file: 'audio/warning/warning-siren.wav', volume: 0.85 },
  { id: 'warning-buzzer', name: 'Còi Buzzer Nguy Hiểm Công Nghiệp', file: 'audio/warning/warning-buzzer.wav', volume: 0.8 },
  { id: 'warning-nuclear', name: 'Còi Báo Động Hạt Nhân Nguy Cấp', file: 'audio/warning/warning-nuclear.wav', volume: 0.85 },
  { id: 'warning-glitch', name: 'Cảnh Báo Lỗi Glitch Cyberpunk', file: 'audio/warning/warning-glitch.wav', volume: 0.75 },
  { id: 'warning-radar', name: 'Radar Cảnh Báo Nguy Hiểm Cao', file: 'audio/warning/warning-radar.wav', volume: 0.8 },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getSoundForQuiz(quizId, overrideCountdown, overrideSuccess, overrideWarning) {
  const hash = hashString(quizId || 'default');
  const cIdx = hash % COUNTDOWN_SOUNDS.length;
  const sIdx = (hash + 1) % SUCCESS_SOUNDS.length;
  const wIdx = (hash + 2) % WARNING_SOUNDS.length;

  const countdownSound = overrideCountdown
    ? COUNTDOWN_SOUNDS.find((s) => s.id === overrideCountdown || s.file === overrideCountdown) || COUNTDOWN_SOUNDS[cIdx]
    : COUNTDOWN_SOUNDS[cIdx];
  const successSound = overrideSuccess
    ? SUCCESS_SOUNDS.find((s) => s.id === overrideSuccess || s.file === overrideSuccess) || SUCCESS_SOUNDS[sIdx]
    : SUCCESS_SOUNDS[sIdx];
  const warningSound = overrideWarning
    ? WARNING_SOUNDS.find((s) => s.id === overrideWarning || s.file === overrideWarning) || {
        id: 'custom-warning',
        name: 'Âm Thanh Cảnh Báo Tùy Biến',
        file: overrideWarning,
        volume: 0.8,
      }
    : WARNING_SOUNDS[wIdx];

  return { countdownSound, successSound, warningSound };
}

// Chuẩn hóa đường dẫn cho lệnh shell trên cả Windows, Linux và macOS
const toSafePath = (filePath) => filePath.replace(/\\/g, '/');

// Tạo nội dung mô tả & hashtag tối ưu cho nền tảng (Facebook / TikTok)
function generateSocialPostContent(quiz, targetPlatform = 'Facebook') {
  const hookTitle = quiz.hookTitleVi || quiz.hookTitle;
  const question = quiz.questionVi || quiz.question;
  const difficulty = quiz.difficultyVi || quiz.difficulty || 'Cơ Bản';
  const category = quiz.categoryVi || quiz.category || 'Lập Trình';

  const langNames = {
    python: 'Python',
    javascript: 'JavaScript',
    cpp: 'C++',
    java: 'Java',
  };
  const langName = langNames[quiz.language] || quiz.language.toUpperCase();

  const langTagsFb = {
    python: ['#Python', '#LapTrinhPython', '#PythonProgramming', '#HocPython'],
    javascript: ['#JavaScript', '#LapTrinhJavaScript', '#JS', '#WebDeveloper'],
    cpp: ['#CPP', '#CPlusPlus', '#LapTrinhCPP', '#LapTrinhC'],
    java: ['#Java', '#LapTrinhJava', '#JavaDeveloper', '#Backend'],
  };

  const fbTags = [
    '#LapTrinh',
    '#HocLapTrinh',
    ...(langTagsFb[quiz.language] || [`#${langName}`]),
    '#CodeQuiz',
    '#LapTrinhVien',
    '#ITVietNam',
    '#CodingChallenge',
    '#TechTips',
  ].join(' ');

  const tiktokTags = [
    '#hoclaptrinh',
    '#laptrinh',
    ...(langTagsFb[quiz.language] ? langTagsFb[quiz.language].map((t) => t.toLowerCase()) : [`#${quiz.language}`]),
    '#codequiz',
    '#learnontiktok',
    '#itvietnam',
    '#coding',
    '#developer',
    '#xuhuong',
    '#fyp',
  ].join(' ');

  const optionsList = quiz.options
    .map((opt) => `  [${opt.key}] ${opt.text}${opt.textVi && opt.textVi !== opt.text ? ` (${opt.textVi})` : ''}`)
    .join('\n');

  const fbSection = `--------------------------------------------------------------------------------
📘 NỀN TẢNG: FACEBOOK (Reels / Post Video / Post Ảnh)
--------------------------------------------------------------------------------
🔥 ${hookTitle} 🔥

🧠 THỬ THÁCH LẬP TRÌNH ${langName.toUpperCase()}:
❓ Câu hỏi: ${question}

💻 Đoạn mã:
\`\`\`${quiz.language}
${quiz.code}
\`\`\`

👇 Lựa chọn của bạn là gì?
${optionsList}

💬 Hãy bình luận ngay đáp án của bạn [A, B, C hay D] bên dưới bình luận trước khi xem kết quả nhé!
💡 Đáp án và giải thích chi tiết có ở cuối video! 🎯

👉 Nhấn Follow kênh để nhận thêm nhiều câu đố và bí kíp lập trình mỗi ngày! 🚀✨

${fbTags}
`;

  const tiktokSection = `--------------------------------------------------------------------------------
🎵 NỀN TẢNG: TIKTOK (Ngắn gọn, giật tít cuốn hút, tối ưu thuật toán tìm kiếm SEO)
--------------------------------------------------------------------------------
${hookTitle} 😱 Bạn có đoán được kết quả của đoạn code ${langName} này không? Comment ngay đáp án của bạn trước khi hết giờ nhé! 👇✨

${tiktokTags}
`;

  const isFb = targetPlatform.toLowerCase() === 'facebook';

  return `================================================================================
📌 NỘI DUNG ĐĂNG BÀI - DÀNH CHO ${targetPlatform.toUpperCase()}
📂 Ngôn ngữ: ${langName} | Độ khó: ${difficulty} | Chủ đề: ${category}
================================================================================

${isFb ? fbSection + '\n' + tiktokSection : tiktokSection + '\n' + fbSection}
================================================================================
`;
}

// 3. Phân chia độc quyền quizzes vào 2 nhóm Facebook và Tiktok (Tuyệt đối không trùng lặp)
function partitionQuizzesByPlatform(quizList) {
  const fbList = [];
  const ttList = [];
  const unassigned = [];

  for (const q of quizList) {
    const p = String(q.platform || '').trim().toLowerCase();
    if (p === 'facebook') {
      fbList.push({ ...q, resolvedPlatform: 'Facebook' });
    } else if (p === 'tiktok') {
      ttList.push({ ...q, resolvedPlatform: 'Tiktok' });
    } else {
      unassigned.push(q);
    }
  }

  // Tự động phân bổ xen kẽ 50/50 cho các câu hỏi chưa cấu hình platform
  for (let i = 0; i < unassigned.length; i++) {
    const q = unassigned[i];
    if (fbList.length <= ttList.length) {
      fbList.push({ ...q, resolvedPlatform: 'Facebook' });
    } else {
      ttList.push({ ...q, resolvedPlatform: 'Tiktok' });
    }
  }

  return { fbList, ttList };
}

// 4. Xử lý tham số dòng lệnh CLI linh hoạt
const args = process.argv.slice(2);
const isFirstOnly = args.includes('--first') || args.includes('-1');
const isStillOnly = args.includes('--still-only') || args.includes('--stills');
const isVideoOnly = args.includes('--video-only');
const isForceInDepth = args.includes('--indepth') || args.includes('--in-depth') || args.includes('--mode=indepth') || args.includes('--mode=in-depth');
const isForceBait = args.includes('--bait') || args.includes('--mode=bait') || args.includes('--mode=engagement-bait');

const platformArg = args.find((a) => a.startsWith('--platform='))?.split('=')[1]?.toLowerCase();
const isFbFilter = args.includes('--facebook') || args.includes('--fb') || platformArg === 'facebook';
const isTtFilter = args.includes('--tiktok') || args.includes('--tt') || platformArg === 'tiktok';

const targetId = args.find((arg) => !arg.startsWith('-') && !arg.includes('=')) || null;

const { fbList, ttList } = partitionQuizzesByPlatform(quizzes);

let quizzesToProcess = [];

if (targetId) {
  const matchedFb = fbList.find((q) => q.id === targetId);
  const matchedTt = ttList.find((q) => q.id === targetId);
  if (matchedFb) {
    quizzesToProcess = [matchedFb];
  } else if (matchedTt) {
    quizzesToProcess = [matchedTt];
  } else {
    console.error(`❌ Không tìm thấy câu hỏi có ID "${targetId}".`);
    console.error(`📋 Danh sách ID có sẵn: ${quizzes.map((q) => q.id).join(', ')}`);
    process.exit(1);
  }
} else if (isFbFilter) {
  quizzesToProcess = isFirstOnly ? fbList.slice(0, 1) : fbList;
} else if (isTtFilter) {
  quizzesToProcess = isFirstOnly ? ttList.slice(0, 1) : ttList;
} else {
  // Mặc định: Xử lý cả 2 nền tảng
  if (isFirstOnly) {
    quizzesToProcess = [
      ...(fbList.length > 0 ? [fbList[0]] : []),
      ...(ttList.length > 0 ? [ttList[0]] : []),
    ];
  } else {
    quizzesToProcess = [...fbList, ...ttList];
  }
}

console.log(`🎬 Chuẩn bị xử lý ${quizzesToProcess.length} bộ video & hình ảnh...`);
console.log(`   📂 Phân loại thư mục:`);
console.log(`      📘 Facebook (${fbList.length} video): ${fbList.map((q) => q.id).join(', ')}`);
console.log(`      🎵 Tiktok   (${ttList.length} video): ${ttList.map((q) => q.id).join(', ')}`);
console.log(`   🔒 Đảm bảo: 2 thư mục hoàn toàn độc lập, không có bất kỳ video nào bị trùng lặp!`);

if (isForceInDepth) {
  console.log(`   🎯 Chế độ ép buộc: TOÀN BỘ là Phương án B: in-depth (16s - Giải thích sâu & Lưu bài)`);
} else if (isForceBait) {
  console.log(`   🎯 Chế độ ép buộc: TOÀN BỘ là Phương án A: engagement-bait (9s - Bẫy comment cực đại)`);
} else {
  console.log(`   🎯 Chế độ: LINH HOẠT & RANDOM XEN KẼ 50/50 GIỮA 2 PHƯƠNG ÁN (A: Bẫy Comment 9s & B: Giải Thích Sâu 16s)`);
}
if (isStillOnly) console.log('   ℹ️ Chế độ: Chỉ render ảnh chụp preview (Bỏ qua video MP4).');
if (isVideoOnly) console.log('   ℹ️ Chế độ: Chỉ render video MP4 (Bỏ qua ảnh chụp preview).');
console.log();

let successCount = 0;
let failCount = 0;

for (let i = 0; i < quizzesToProcess.length; i++) {
  const quiz = quizzesToProcess[i];
  const platformFolder = quiz.resolvedPlatform; // 'Facebook' hoặc 'Tiktok'
  const platformDir = path.join(outDir, platformFolder);

  if (!fs.existsSync(platformDir)) {
    fs.mkdirSync(platformDir, { recursive: true });
  }

  const originalIdx = quizzes.findIndex((q) => q.id === quiz.id);
  const orderNumber = (originalIdx >= 0 ? originalIdx : i) + 1;
  const folderName = quiz.folderNameVi || `${String(orderNumber).padStart(2, '0')}_${quiz.id}`;
  const quizDir = path.join(platformDir, folderName);

  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir, { recursive: true });
  }

  // Xác định chế độ hiển thị linh hoạt cho từng quiz
  const isQuizInDepth = isForceInDepth
    ? true
    : isForceBait
      ? false
      : quiz.displayMode
        ? quiz.displayMode === 'in-depth'
        : i % 2 === 1;

  const currentDisplayMode = isQuizInDepth ? 'in-depth' : 'engagement-bait';
  const compositionId = isQuizInDepth ? `indepth-${quiz.id}` : quiz.id;

  const videoPath = path.join(quizDir, 'video_hoan_chinh.mp4');
  const questionImgPath = path.join(quizDir, 'anh_cau_hoi.png');
  const countdownImgPath = path.join(quizDir, 'anh_dem_nguoc.png');
  const revealImgPath = path.join(quizDir, 'anh_cong_bo_dap_an.png');
  const postContentPath = path.join(quizDir, 'mo_ta_dang_bai.txt');
  const metadataPath = path.join(quizDir, 'thong_tin_cau_do.json');

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`[${i + 1}/${quizzesToProcess.length}] 📁 Thư mục: out/${platformFolder}/${folderName}`);
  console.log(`   🌐 Nền tảng: ${platformFolder.toUpperCase()}`);
  console.log(`   Tiêu đề EN: ${quiz.hookTitle}`);
  console.log(`   Tiêu đề VI: ${quiz.hookTitleVi || ''}`);
  console.log(`   Ngôn ngữ:   ${quiz.language.toUpperCase()}`);
  console.log(`   🎯 Phương án: ${isQuizInDepth ? 'B (in-depth: 16s - Show đáp án đúng + Giải thích sâu)' : 'A (engagement-bait: 9s - Bẫy comment không show đáp án)'}`);

  const { countdownSound, successSound, warningSound } = getSoundForQuiz(quiz.id, quiz.audioCountdown, quiz.audioSuccess, quiz.audioWarning);
  console.log(`   🚨 Cảnh báo:   ${warningSound.name} (${warningSound.file}) [vol: ${warningSound.volume}]`);
  console.log(`   ⏱️ Đếm ngược:  ${countdownSound.name} (${countdownSound.file}) [vol: ${countdownSound.volume}]`);
  console.log(`   🎉 Chúc mừng:   ${successSound.name} (${successSound.file}) [vol: ${successSound.volume}]`);

  try {
    // 1. Render Video MP4 (Lossless PNG frame buffer, CRF 14)
    if (!isStillOnly) {
      console.log(`   🎥 Đang render video độ nét cao: video_hoan_chinh.mp4 (${currentDisplayMode})...`);
      const cmdVideo = `npx remotion render src/index.ts "${compositionId}" "${toSafePath(videoPath)}" --image-format=jpeg --pixel-format=yuv420p --concurrency=4`;
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
      const cmdCountdown = `npx remotion still src/index.ts "${compositionId}" "${toSafePath(countdownImgPath)}" --image-format=png --frame=100`;
      execSync(cmdCountdown, { cwd: projectRoot, stdio: 'inherit' });

      // 2c. Ảnh công bố đáp án / Bẫy tương tác (frame 220)
      console.log(`   📸 Đang render ảnh Giai đoạn 3 (${currentDisplayMode}): anh_cong_bo_dap_an.png (frame 220)...`);
      const cmdReveal = `npx remotion still src/index.ts "${compositionId}" "${toSafePath(revealImgPath)}" --image-format=png --frame=220`;
      execSync(cmdReveal, { cwd: projectRoot, stdio: 'inherit' });
    }

    // 3. Tạo file mô tả & hashtag đăng bài chuyên biệt cho Facebook / TikTok
    fs.writeFileSync(postContentPath, generateSocialPostContent(quiz, platformFolder), 'utf-8');
    console.log(`   📝 Đã lưu nội dung đăng bài tối ưu cho ${platformFolder}: mo_ta_dang_bai.txt`);

    // 4. Lưu metadata thông tin câu đố JSON
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          id: quiz.id,
          platform: platformFolder,
          folderNameVi: folderName,
          targetFolder: `out/${platformFolder}/${folderName}`,
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
            postCaptions: 'mo_ta_dang_bai.txt',
          },
          renderedAt: new Date().toISOString(),
          resolution: '1080x1920',
          fps: 30,
          durationFrames: isQuizInDepth ? 480 : 270,
          durationSeconds: isQuizInDepth ? 16 : 9,
        },
        null,
        2
      ),
      'utf-8'
    );

    console.log(`   ✅ Hoàn thành xuất sắc: out/${platformFolder}/${folderName}\n`);
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
  console.log('🎉 TẤT CẢ TỆP ĐÃ ĐƯỢC XUẤT VÀ PHÂN LOẠI VÀO 2 FOLDER:');
  console.log('   📘 out/Facebook/ (Tất cả video dành riêng cho Facebook)');
  console.log('   🎵 out/Tiktok/   (Tất cả video dành riêng cho TikTok)');
  console.log('   ✨ 100% video KHÁC NHAU, KHÔNG TRÙNG LẶP!');
}
