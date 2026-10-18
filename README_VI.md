# ⚡ Trình Tạo Video Quiz Lập Trình Tự Động (Remotion + React)

> 📖 *[English Documentation](README.md) | **Bản Tiếng Việt***

Dự án hoàn chỉnh, chuẩn production được xây dựng bằng **Remotion (v4+)**, **React**, **TypeScript**, **TailwindCSS** và **`prism-react-renderer`**. Dự án cho phép bạn tự động sản xuất các video câu đố lập trình dạng dọc (**TikTok, Instagram Reels, YouTube Shorts**) với độ nét cao (1080x1920), giao diện hiện đại, màu sắc bắt mắt và tỷ lệ chuyển đổi/giữ chân người xem cực cao.

---

## 📌 1. Thông Số Kỹ Thuật Chuẩn

- **Định dạng khung hình**: 1080 x 1920 px (tỷ lệ 9:16 dọc dành cho thiết bị di động).
- **Tốc độ khung hình (FPS)**: 30 FPS.
- **Thời lượng chuẩn**: 10 giây (300 frames) — thời lượng vàng cho các clip quiz giữ chân người xem 100% đến cuối.
- **Tô màu cú pháp (Syntax Highlighting)**: Tích hợp thư viện `prism-react-renderer` với theme Dracula / One Dark sắc nét.
- **Dữ liệu đầu vào**: Đọc trực tiếp từ file JSON cấu trúc (`src/data/quizzes.json`).
- **Giao diện chỉnh sửa trực quan (Remotion Studio)**: Hỗ trợ Zod Schema giúp sửa câu hỏi, code và đáp án trực tiếp trên web UI mà không cần gõ code.
- **Chuyển động mượt mà (Frame-pure Animations)**: 100% animation chạy bằng hàm toán học của Remotion (`spring`, `interpolate`), cam kết video render ra không bị giật lag hay lệch khung hình.

---

## ⏱️ 2. Kịch Bản & Phân Cảnh Video (Storyboard 10 Giây)

Một video quiz thành công cần nhịp điệu nhanh, rõ ràng và tạo sự hồi hộp:

```
[0s — 1s]           [1s — 7s]                     [7s — 10s]
  Hook & Đề bài  ➔    Đếm ngược suy nghĩ (6s)  ➔    Công bố đáp án & Giải thích
```

| Mốc thời gian | Số Frame | Phân cảnh | Nội dung hiển thị & Hiệu ứng |
|---|---|---|---|
| **0.0s – 1.0s** | Frame 0 – 30 | **Hook & Mở đầu** | • Huy hiệu gây sốc: `🔥 SENIOR DEV TRAP` + Độ khó (`MEDIUM` / `HARD`).<br>• Tiêu đề Hook to, gradient chuyển màu bắt mắt (ví dụ: *"99% Miss This Python Logic!"*).<br>• Tag ngôn ngữ kèm icon (Python, JavaScript, C++, Java).<br>• Khung terminal phong cách macOS trượt vào với đoạn code được highlight đẹp mắt. |
| **1.0s – 7.0s** | Frame 30 – 210 | **Suy nghĩ & Đếm ngược** | • 4 phương án lựa chọn (A, B, C, D) lần lượt xuất hiện theo hiệu ứng bậc thang (staggered bounce).<br>• Đồng hồ đếm ngược SVG dạng vòng tròn thu hẹp dần từ 5s về 0s.<br>• Màu đồng hồ đổi dần: **Xanh Cyan** ➔ **Vàng Amber** ➔ **Đỏ rực** kèm nhịp đập tim (heartbeat pulse) ở 2 giây cuối để kích thích người xem comment ngay. |
| **7.0s – 10.0s** | Frame 210 – 300 | **Công bố & Giải thích** | • Thông báo *"TIME'S UP! REVEALED 🎯"* xuất hiện.<br>• Phương án đúng phóng to nhẹ, phát sáng neon xanh lá ngọc bảo (`#10b981`) kèm biểu tượng `✓ WIN`.<br>• Các phương án sai tự động mờ dần đi.<br>• **Pháo hoa giấy (Confetti)** bung nổ rực rỡ từ vị trí đáp án.<br>• Thẻ giải thích (`Explanation Card`) trượt từ dưới lên, phân tích ngắn gọn lý do vì sao kèm lời kêu gọi tương tác (CTA). |

---

## 📂 3. Cấu Trúc Thư Mục Dự Án

```
Code_Video_Quizz/
├── out/                    # Thư mục chứa video MP4 và ảnh sau khi render
├── public/                 # Chứa tài nguyên tĩnh (âm thanh, logo, font, hình ảnh)
├── scripts/
│   └── renderAll.mjs       # Script render tự động tất cả câu đố ra video riêng
├── src/
│   ├── components/
│   │   ├── Background.tsx       # Nền Cyberpunk tối với ánh sáng chuyển động & visualizer âm thanh
│   │   ├── CodeWindow.tsx       # Khung code chuẩn Mac terminal + Prism syntax highlighting
│   │   ├── Confetti.tsx         # Hiệu ứng nổ pháo hoa giấy vật lý khi công bố đáp án
│   │   ├── CountdownTimer.tsx   # Đồng hồ đếm ngược tròn SVG kèm hiệu ứng tim đập
│   │   ├── ExplanationCard.tsx  # Thẻ trượt giải thích chi tiết nguyên lý "bẫy"
│   │   ├── HeaderHook.tsx       # Tiêu đề giật tít, badge ngôn ngữ & độ khó
│   │   ├── QuestionBox.tsx      # Lưới 4 đáp án A-B-C-D với hiệu ứng phát sáng khi đúng
│   │   └── QuizVideo.tsx        # Component tổng hợp bố cục khung hình 1080x1920
│   ├── data/
│   │   └── quizzes.json         # File dữ liệu chứa danh sách toàn bộ câu đố
│   ├── types/
│   │   └── quiz.ts              # Định nghĩa kiểu dữ liệu TypeScript & Zod Schema
│   ├── utils/
│   │   ├── languageTheme.ts     # Cấu hình màu sắc, logo, icon cho từng ngôn ngữ
│   │   └── prismSetup.ts        # Đăng ký ngữ pháp cú pháp cho PrismJS (Python, JS, C++, Java)
│   ├── index.css                # CSS cấu hình typography (Google Fonts Outfit, JetBrains Mono)
│   ├── index.ts                 # Điểm khởi đầu đăng ký Root với Remotion
│   └── Root.tsx                 # Khai báo các Compositions và Folder trong Remotion Studio
├── package.json             # Khai báo thư viện và các câu lệnh chạy
├── remotion.config.ts       # Cấu hình Rspack & TailwindCSS v4 cho Remotion
└── tsconfig.json            # Cấu hình TypeScript
```

---

## 🛠️ 4. Hướng Dẫn Từng Bước Làm Ra 1 Video Hoàn Chỉnh

### Bước 1: Cài đặt môi trường cần thiết
Đảm bảo máy tính của bạn đã cài đặt:
- **Node.js** phiên bản 20 trở lên (khuyên dùng Node 22 LTS hoặc Node 24).
- Mở terminal tại thư mục dự án và cài đặt dependencies (nếu clone về máy mới):
  ```bash
  npm install
  ```

---

### Bước 2: Thêm nội dung câu hỏi mới vào `src/data/quizzes.json`

Mở file [`src/data/quizzes.json`](src/data/quizzes.json) và thêm một đối tượng câu hỏi mới theo mẫu chuẩn sau:

```json
{
  "id": "python-mutable-default",
  "hookTitle": "99% Lập Trình Viên Mắc Lỗi Này!",
  "language": "python",
  "code": "def them_phan_tu(val, danh_sach=[]):\n    danh_sach.append(val)\n    return danh_sach\n\nprint(them_phan_tu(1))\nprint(them_phan_tu(2))",
  "question": "Kết quả in ra màn hình là gì?",
  "options": [
    {
      "key": "A",
      "text": "[1] sau đó [2]"
    },
    {
      "key": "B",
      "text": "[1] sau đó [1, 2]"
    },
    {
      "key": "C",
      "text": "[1] sau đó [2, 1]"
    },
    {
      "key": "D",
      "text": "Lỗi TypeError"
    }
  ],
  "correctAnswer": "B",
  "explanation": "Trong Python, giá trị mặc định của hàm chỉ được khởi tạo 1 LẦN DUY NHẤT khi định nghĩa hàm! Các lần gọi tiếp theo dùng chung danh sách này trong bộ nhớ.",
  "difficulty": "Hard",
  "category": "Scope & Mutability"
}
```

#### 💡 Ý nghĩa từng trường dữ liệu:
- `id` *(bắt buộc)*: Mã định danh duy nhất (dùng làm tên file video khi xuất ra, ví dụ: `python-mutable-default.mp4`).
- `hookTitle` *(bắt buộc)*: Câu giật tít hiển thị lớn trên cùng (nên ngắn gọn, kích thích trí tò mò).
- `language` *(bắt buộc)*: Một trong 4 ngôn ngữ được hỗ trợ:
  - `"python"` ➔ Huy hiệu 🐍 Python 3.12, theme màu Cyan/Amber, file `main.py`.
  - `"javascript"` ➔ Huy hiệu ⚡ JavaScript ES2024, theme màu Vàng, file `index.js`.
  - `"cpp"` ➔ Huy hiệu ⚙️ C++20, theme màu Xanh lam/Indigo, file `main.cpp`.
  - `"java"` ➔ Huy hiệu ☕ Java 21, theme màu Cam/Đỏ, file `Main.java`.
- `code` *(bắt buộc)*: Đoạn code minh họa (dùng `\n` để xuống dòng). Khuyên dùng từ 4 đến 8 dòng để font chữ to rõ nhất.
- `question` *(bắt buộc)*: Câu hỏi ngắn gọn (ví dụ: *"Kết quả in ra là gì?"*).
- `options` *(bắt buộc)*: Mảng 4 đáp án gồm `key` ('A', 'B', 'C', 'D') và `text`.
- `correctAnswer` *(bắt buộc)*: Chữ cái đáp án đúng (`"A"`, `"B"`, `"C"` hoặc `"D"`).
- `explanation` *(bắt buộc)*: Câu giải thích ngắn gọn, súc tích (1-2 câu) về nguyên lý code.
- `difficulty` *(tùy chọn)*: Mức độ (`"Easy"`, `"Medium"`, `"Hard"`, `"Extreme"`).
- `category` *(tùy chọn)*: Phân loại kiến thức (ví dụ: *"Type Coercion"*, *"Data Structures"*).

---

### Bước 3: Xem trước và tinh chỉnh trực tiếp trên giao diện Studio

Chạy lệnh:
```bash
npm run dev
```

1. Terminal sẽ khởi chạy Remotion Studio tại: [http://localhost:3000](http://localhost:3000).
2. Trình duyệt tự động mở lên:
   - Bên trái danh sách: bạn sẽ thấy composition **`MainQuiz`** và thư mục **`All-Quizzes`** (chứa từng câu hỏi riêng biệt).
   - Bạn có thể **bấm Space** để Play/Pause, kéo thanh thời gian (Scrubber) để xem hiệu ứng từng frame (từ frame 0 đến frame 300).
   - Ở cột bên phải: bảng **Props** cho phép bạn sửa đổi nội dung câu hỏi, đổi đáp án và thấy ngay kết quả cập nhật lập tức trên màn hình!

---

### Bước 4: Xuất (Render) video ra file MP4 hoàn chỉnh

Khi đã ưng ý với nội dung và hoạt họa, bạn có 3 lựa chọn để render:

#### Cách 1: Render video mặc định (`MainQuiz`)
```bash
npm run render
```
> Video kết quả sẽ được tạo tại: `out/quiz.mp4`.

#### Cách 2: Render tự động HÀNG LOẠT tất cả câu hỏi trong `quizzes.json`
```bash
npm run render:all
```
> Script sẽ duyệt qua toàn bộ danh sách trong `quizzes.json` và render thành từng file riêng biệt:
> - `out/python-mutable-default.mp4`
> - `out/javascript-array-coercion.mp4`
> - `out/cpp-reference-reseat.mp4`
> - `out/java-integer-cache.mp4`
> - ...

#### Cách 3: Render chỉ 1 câu hỏi cụ thể theo ID
Nếu bạn chỉ muốn render câu đố C++:
```bash
npx remotion render src/index.ts "cpp-reference-reseat" out/cpp-quiz.mp4
```

#### Cách 4: Xuất ảnh thumbnail / frame tĩnh chất lượng cao
Để lấy ảnh xem trước lúc đáp án được công bố (frame 240):
```bash
npm run render:still
```
> Ảnh tĩnh 1080x1920 sắc nét sẽ được lưu tại `out/preview.png`.

---

### Bước 5: Kiểm tra và xuất bản video lên mạng xã hội

1. Mở thư mục `out/` trên máy tính của bạn: `d:\Source\Code_Video_Quizz\out\`.
2. Mở file `.mp4` lên xem lại:
   - Kiểm tra xem chữ có bị tràn viền không.
   - Kiểm tra mã màu syntax highlighting có nổi bật không.
   - Kiểm tra thời gian đếm ngược và đáp án mở ra chính xác.
3. Tải lên **TikTok**, **YouTube Shorts**, **Instagram Reels**, hoặc **Facebook Reels**:
   - Thêm nhạc nền công nghệ hoặc âm thanh "tích tắc" đếm ngược đang thịnh hành (trending sound) trực tiếp trên app để tăng độ viral.
   - Thêm caption: *"Bạn đoán đúng câu này không? Bình luận đáp án của bạn nhé! 👇 #coding #python #programming #quiz"*.

---

## 🎨 5. Tùy Chỉnh Nâng Cao (Customization)

### Thay đổi thời lượng video:
Nếu bạn muốn video dài hơn (ví dụ 15 giây = 450 frames ở 30 FPS):
1. Trong file [`src/Root.tsx`](src/Root.tsx): đổi `durationInFrames={450}`.
2. Trong component [`src/components/CountdownTimer.tsx`](src/components/CountdownTimer.tsx): điều chỉnh `startFrame` và `endFrame` (ví dụ từ frame 30 đến 360).
3. Trong component [`src/components/QuestionBox.tsx`](src/components/QuestionBox.tsx) & [`src/components/ExplanationCard.tsx`](src/components/ExplanationCard.tsx): đổi `revealFrame={360}`.

### Tùy chỉnh màu sắc & biểu tượng ngôn ngữ:
Vào file [`src/utils/languageTheme.ts`](src/utils/languageTheme.ts) để bổ sung thêm ngôn ngữ (ví dụ: Go, Rust, TypeScript, C#) hoặc đổi màu ánh sáng neon (glowColor), màu gradient theo sở thích thương hiệu cá nhân của bạn.

---

## 📋 6. Bảng Tra Cứu Các Lệnh (Cheat Sheet)

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Khởi chạy Remotion Studio xem trước và chỉnh sửa realtime trên trình duyệt |
| `npm run render` | Xuất video MP4 cho câu đố chính (`out/quiz.mp4`) |
| `npm run render:all` | Tự động xuất video MP4 cho TẤT CẢ câu đố có trong `quizzes.json` |
| `npm run render:still` | Xuất 1 tấm ảnh tĩnh độ nét cao 1080x1920 tại frame 240 làm thumbnail |
| `npm run lint` | Kiểm tra toàn bộ mã nguồn TypeScript và ESLint để đảm bảo không có lỗi |
| `npm run build` | Đóng gói bundle mã nguồn Remotion phục vụ triển khai Cloud / Server |

---

*Chúc bạn tạo ra thật nhiều video lập trình triệu view! Nếu có thắc mắc hoặc cần mở rộng thêm tính năng, hãy mở issue hoặc liên hệ đóng góp nhé!* 🚀
