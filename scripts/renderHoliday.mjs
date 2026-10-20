import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Thư mục đầu ra chuyên biệt: "out/Ngày lễ"
const holidayDirName = 'Ngày lễ';
const holidayRoot = path.join(projectRoot, 'out', holidayDirName);
const specificHolidayDir = path.join(holidayRoot, '20_10_Phu_Nu_Viet_Nam');

if (!fs.existsSync(specificHolidayDir)) {
  fs.mkdirSync(specificHolidayDir, { recursive: true });
}

const toSafePath = (filePath) => filePath.replace(/\\/g, '/');

const videoPath = path.join(specificHolidayDir, 'video_chuc_mung_20_10.mp4');
const stillPath = path.join(specificHolidayDir, 'anh_preview_20_10.png');
const captionPath = path.join(specificHolidayDir, 'mo_ta_dang_bai.txt');
const metadataPath = path.join(specificHolidayDir, 'thong_tin_ngay_le.json');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌸 BẮT ĐẦU SẢN XUẤT VIDEO CHÚC MỪNG NGÀY LỄ 20/10 🌸');
console.log('   📁 Thư mục lưu trữ: out/Ngày lễ/20_10_Phu_Nu_Viet_Nam');
console.log('   🎨 Định dạng: 1080x1920 (9:16) | 30 FPS | Thời lượng 12 giây');
console.log('   🌹 Điểm nhấn: Đóa hoa hồng đỏ nở dần phát sáng + Pháo hoa 4 góc');
console.log('   ✨ Văn bản mạ vàng: "Chúc bạn luôn rạng rỡ, bình an trong tâm hồn..."');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  // 1. Render Video MP4 chất lượng cao
  console.log('🎥 [1/2] Đang render video hoàn chỉnh: video_chuc_mung_20_10.mp4...');
  const cmdVideo = `npx remotion render src/index.ts "Holiday-20-10" "${toSafePath(videoPath)}" --image-format=jpeg --pixel-format=yuv420p --concurrency=4`;
  execSync(cmdVideo, { cwd: projectRoot, stdio: 'inherit' });

  // 2. Render ảnh chụp đại diện (Frame 150 - lúc hoa hồng nở rực rỡ và câu chúc hiện rõ)
  console.log('\n📸 [2/2] Đang render ảnh preview đại diện: anh_preview_20_10.png...');
  const cmdStill = `npx remotion still src/index.ts "Holiday-20-10" "${toSafePath(stillPath)}" --image-format=png --frame=150`;
  execSync(cmdStill, { cwd: projectRoot, stdio: 'inherit' });

  // 3. Tạo file mô tả & hashtag đăng bài
  const captionContent = `================================================================================
🌹 LỜI CHÚC Ý NGHĨA NGÀY PHỤ NỮ VIỆT NAM 20/10 🌹
================================================================================

✨ 20 • 10 - CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM ✨

"Chúc bạn luôn rạng rỡ, bình an trong tâm hồn và được yêu thương theo cách trọn vẹn nhất." 💖

Gửi gắm ngàn đóa hoa hồng thắm cùng những lời chúc tốt đẹp, bình yên và hạnh phúc nhất tới tất cả những người phụ nữ tuyệt vời xung quanh chúng ta! Mong bạn mỗi ngày đều mỉm cười tự tin, luôn xinh đẹp và tỏa sáng như đóa hồng nhung kiêu sa! 🌹✨

#20thang10 #NgayPhuNuVietNam #VietnameseWomensDay #PhuNuVietNam #ChucMung2010 #YeuThuong #PhuNuLaDeYeuThuong #HoaHongDo #LoiChucYnghia #ViralVideo #Trending
================================================================================
`;
  fs.writeFileSync(captionPath, captionContent, 'utf-8');

  // 4. Lưu metadata JSON
  const metadata = {
    holidayName: '20/10 - Ngày Phụ Nữ Việt Nam',
    outputFolder: 'out/Ngày lễ/20_10_Phu_Nu_Viet_Nam',
    title: 'Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10',
    quote: 'Chúc bạn luôn rạng rỡ, bình an trong tâm hồn và được yêu thương theo cách trọn vẹn nhất.',
    canvas: {
      width: 1080,
      height: 1920,
      fps: 30,
      durationFrames: 360,
      durationSeconds: 12,
    },
    visualElements: {
      theme: 'Midnight Blue & Deep Dark Purple Gradient',
      centerpiece: 'Procedural Blooming Glowing Red Rose with organic swaying',
      fireworks: 'Continuous 4-corner multi-color particle fireworks system (Gold, Pink, Red, Purple)',
      typography: 'Gold glow metallic shimmer typography supporting Vietnamese diacritics',
    },
    files: {
      video: 'video_chuc_mung_20_10.mp4',
      previewImage: 'anh_preview_20_10.png',
      caption: 'mo_ta_dang_bai.txt',
    },
    renderedAt: new Date().toISOString(),
  };
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log('\n🎉 HOÀN TẤT THÀNH CÔNG XUẤT SẮC!');
  console.log(`📁 Video final đã được xuất vào: ${videoPath}`);
} catch (err) {
  console.error('\n❌ Lỗi trong quá trình render video ngày lễ:', err.message);
  process.exit(1);
}
