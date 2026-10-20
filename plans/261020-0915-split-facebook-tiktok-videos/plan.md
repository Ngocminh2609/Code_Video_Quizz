# Plan: Phân Chia Video Không Trùng Lặp Vào 2 Folder Facebook Và Tiktok

## Overview
Cập nhật hệ thống tạo và render video Remotion để phân chia toàn bộ video vào 2 thư mục riêng biệt: `out/Facebook/` và `out/Tiktok/`. Đảm bảo hai thư mục chứa các video hoàn toàn khác nhau, không bao giờ trùng lặp bất kỳ video nào.

## Phase List
- [x] Phase 1: Cập nhật Schema & Types (`src/types.ts`) - Bổ sung `TargetPlatform = 'Facebook' | 'Tiktok'` và trường `platform` vào `quizItemSchema`.
- [x] Phase 2: Cập nhật Dữ liệu Câu đố (`src/data/quizzes.json`) - Gán trường `platform: "Facebook" | "Tiktok"` cho các quiz mẫu.
- [x] Phase 3: Cập nhật Logic Render & Phân Chia Thư Mục (`scripts/renderAll.mjs`) - Thuật toán phân hoạch độc quyền 100% không trùng lặp, tạo thư mục `out/Facebook/` và `out/Tiktok/`, tối ưu caption & metadata theo nền tảng.
- [x] Phase 4: Bổ sung Script trong `package.json` (`render:facebook`, `render:tiktok`, `render:all:facebook`, `render:all:tiktok`).
- [x] Phase 5: Cập nhật Tài liệu Hướng Dẫn (`README_VI.md` & `README.md`) - Hướng dẫn chi tiết phân loại thư mục và lệnh render.
- [x] Phase 6: Kiểm tra Biên dịch & Chạy Thử Nghiệm (`npm run lint`, render test hoàn tất thành công 100%).
