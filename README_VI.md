# ⚡ Trình Tạo Video Quiz Lập Trình Tự Động Song Ngữ (Remotion + React)

> 📖 *[English Documentation](README.md) | **Bản Tiếng Việt***

Dự án hoàn chỉnh, chuẩn production được xây dựng bằng **Remotion (v4+)**, **React**, **TypeScript**, **TailwindCSS** và **`prism-react-renderer`**. Dự án tự động sản xuất các video câu đố lập trình **Song Ngữ (Tiếng Anh & Tiếng Việt)** chuẩn định dạng dọc (**TikTok, Instagram Reels, YouTube Shorts**) với độ nét 1080x1920, màu sắc bắt mắt, hiệu ứng kịch tính và tự động phân loại từng video cùng ảnh chụp vào các thư mục tiếng Việt riêng biệt.

---

## 🌟 Tính Năng Song Ngữ & Quản Lý Thư Mục Đầu Ra

1. **Giao diện Video Song Ngữ Hoàn Chỉnh (English + Tiếng Việt)**:
   - **Tiêu đề giật tít**: Dòng trên Tiếng Anh (`hookTitle`) + Dòng dưới Tiếng Việt nổi bật (`hookTitleVi`).
   - **Huy hiệu**: `🔥 DEV TRAP • BẪY LẬP TRÌNH` và độ khó `MEDIUM • VỪA` / `HARD • KHÓ`.
   - **Đồng hồ đếm ngược**: Hiển thị trạng thái song ngữ (`THINK CAREFULLY • HÃY SUY NGHĨ KỸ...`, `TIME'S UP! • HẾT GIỜ! 🎯`).
   - **Câu hỏi & Đáp án**: Câu hỏi chính tiếng Anh kèm dòng dịch nghĩa tiếng Việt (`questionVi`) ngay bên dưới.
   - **Thẻ giải thích cuối video**: Hiển thị cả 2 đoạn phân tích cặn kẽ có cờ đại diện 🇬🇧 Tiếng Anh và 🇻🇳 Tiếng Việt, cùng lời kêu gọi bình luận (CTA) song ngữ.

2. **Sắp Xếp & Đặt Tên Thư Mục Tiếng Việt Chuẩn Hóa**:
   Khi xuất video (bằng lệnh `npm run render` hoặc `npm run render:all`), toàn bộ tài nguyên của mỗi video sẽ được tự động tạo và gom vào một thư mục riêng biệt đặt tên tiếng Việt rõ ràng:

   ```
   out/
   ├── 01_Python_Gia_Tri_Mac_Dinh_List/
   │   ├── video_hoan_chinh.mp4      # Video MP4 10s (1080x1920, 30 FPS)
   │   ├── anh_cau_hoi.png           # Ảnh câu hỏi thuần túy (KHÔNG đếm ngược, KHÔNG đáp án)
   │   ├── anh_dem_nguoc.png         # Ảnh frame 100 (thời điểm đếm ngược suy nghĩ)
   │   ├── anh_cong_bo_dap_an.png    # Ảnh frame 240 (thời điểm công bố đáp án + pháo hoa)
   │   ├── thong_tin_cau_do.json     # Metadata chi tiết song ngữ của câu đố
   │   └── mo_ta_dang_bai.txt        # Caption kèm icon & hashtag tối ưu cho Facebook & TikTok
   ├── 02_JavaScript_Ep_Kieu_Cong_Mang/
   │   ├── video_hoan_chinh.mp4
   │   ├── anh_cau_hoi.png
   │   ├── anh_dem_nguoc.png
   │   ├── anh_cong_bo_dap_an.png
   │   ├── thong_tin_cau_do.json
   │   └── mo_ta_dang_bai.txt
   ├── 03_CPP_Tham_Chieu_Khong_The_Gan_Lai/
   ├── 04_Java_Bo_Nho_Dem_Integer_Cache/
   └── 05_Python_Bien_Doi_List_Trong_Tuple/
   ```

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

```
[0s — 1s]           [1s — 7s]                     [7s — 10s]
  Hook & Đề bài  ➔    Đếm ngược suy nghĩ (6s)  ➔    Công bố đáp án & Giải thích
```

| Mốc thời gian | Số Frame | Phân cảnh | Nội dung hiển thị & Hiệu ứng |
|---|---|---|---|
| **0.0s – 1.0s** | Frame 0 – 30 | **Hook & Mở đầu** | • Huy hiệu: `🔥 DEV TRAP • BẪY LẬP TRÌNH` + Độ khó song ngữ.<br>• Tiêu đề Hook Song Ngữ chuyển màu bắt mắt (ví dụ: *"99% Miss This Python Logic! / 99% Lập Trình Viên Mắc Bẫy Này!"*).<br>• Tag ngôn ngữ kèm icon (Python, JavaScript, C++, Java).<br>• Khung terminal phong cách macOS trượt vào với đoạn code được highlight đẹp mắt. |
| **1.0s – 7.0s** | Frame 30 – 210 | **Suy nghĩ & Đếm ngược** | • 4 phương án lựa chọn (A, B, C, D) lần lượt xuất hiện theo hiệu ứng bậc thang (staggered bounce).<br>• Đồng hồ đếm ngược SVG dạng vòng tròn thu hẹp dần từ 5s về 0s.<br>• Màu đồng hồ đổi dần: **Xanh Cyan** ➔ **Vàng Amber** ➔ **Đỏ rực** kèm nhịp đập tim (heartbeat pulse) ở 2 giây cuối để kích thích người xem comment ngay. |
| **7.0s – 10.0s** | Frame 210 – 300 | **Công bố & Giải thích** | • Thông báo *"TIME'S UP! • HẾT GIỜ! 🎯"* xuất hiện.<br>• Phương án đúng phóng to nhẹ, phát sáng neon xanh lá ngọc bảo (`#10b981`) kèm biểu tượng `✓ WIN`.<br>• Các phương án sai tự động mờ dần đi.<br>• **Pháo hoa giấy (Confetti)** bung nổ rực rỡ từ vị trí đáp án.<br>• Thẻ giải thích song ngữ (`Explanation Card`) trượt từ dưới lên, phân tích ngắn gọn lý do vì sao kèm lời kêu gọi tương tác (CTA). |

---

## 🛠️ 3. Hướng Dẫn Từng Bước Làm Ra 1 Video Hoàn Chỉnh

### Bước 1: Khởi động dự án
Mở terminal tại thư mục dự án và cài đặt dependencies (nếu clone máy mới):
```bash
npm install
```

---

### Bước 2: Thêm nội dung câu đố Song Ngữ vào `src/data/quizzes.json`

Mở file [`src/data/quizzes.json`](src/data/quizzes.json) và thêm câu hỏi theo mẫu:

```json
{
  "id": "python-mutable-default",
  "folderNameVi": "01_Python_Gia_Tri_Mac_Dinh_List",
  "hookTitle": "99% Miss This Python Logic!",
  "hookTitleVi": "99% Lập Trình Viên Mắc Bẫy Này! 🐍",
  "language": "python",
  "code": "def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))",
  "question": "What will be printed?",
  "questionVi": "Kết quả in ra màn hình là gì?",
  "options": [
    { "key": "A", "text": "[1] then [2]", "textVi": "[1] rồi đến [2]" },
    { "key": "B", "text": "[1] then [1, 2]", "textVi": "[1] rồi đến [1, 2]" },
    { "key": "C", "text": "[1] then [2, 1]", "textVi": "[1] rồi đến [2, 1]" },
    { "key": "D", "text": "TypeError: modified", "textVi": "Lỗi TypeError" }
  ],
  "correctAnswer": "B",
  "explanation": "Default list arguments are created ONCE when the function is defined! Successive calls reuse the exact same mutable list in memory.",
  "explanationVi": "Trong Python, đối số mặc định chỉ được tạo 1 LẦN DUY NHẤT khi định nghĩa hàm! Các lần gọi tiếp theo dùng chung đối tượng danh sách này trong bộ nhớ.",
  "difficulty": "Medium",
  "difficultyVi": "Vừa",
  "category": "Scope & Mutability",
  "categoryVi": "Phạm Vi & Tính Biến Đổi"
}
```

---

### Bước 3: Xem trước và tinh chỉnh trên Remotion Studio

Chạy lệnh:
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để:
- Bấm **Space** để xem chạy thử chuyển động video.
- Kéo thanh timeline để soi từng khung hình.
- Sửa trực tiếp nội dung tiếng Anh/tiếng Việt trên bảng điều khiển bên phải.

---

### Bước 4: Xuất (Render) video và hình ảnh vào từng thư mục riêng

#### Cách 1: Xuất 1 video đầu tiên kèm bộ ảnh vào thư mục tiếng Việt
```bash
npm run render
```
> Tự động tạo thư mục: `out/01_Python_Gia_Tri_Mac_Dinh_List/` chứa video `.mp4`, ảnh đếm ngược và ảnh công bố đáp án.

#### Cách 2: Xuất TỰ ĐỘNG HÀNG LOẠT tất cả câu hỏi
```bash
npm run render:all
```
> Script sẽ chạy lần lượt và tạo ra từng thư mục riêng biệt cho từng quiz trong `out/`.

---

## 📋 4. Bảng Tra Cứu Các Lệnh (Cheat Sheet)

| Lệnh | Ý nghĩa |
|---|---|
| `npm run dev` | Bật Remotion Studio xem trước trực tiếp trên trình duyệt |
| `npm run render` | Xuất video và bộ ảnh của câu đố đầu tiên vào thư mục tiếng Việt riêng |
| `npm run render:all` | Xuất HÀNG LOẠT tất cả các video vào từng thư mục tiếng Việt tương ứng |
| `npm run render:still` | Xuất nhanh 1 ảnh tĩnh snapshot |
| `npm run lint` | Kiểm tra toàn bộ mã nguồn TypeScript và ESLint |

---

*Chúc bạn tạo ra thật nhiều video lập trình triệu view!* 🚀
