import { z } from 'zod';

export const holidayConfigSchema = z.object({
  holidayName: z.string().default('20/10 - Ngày Phụ Nữ Việt Nam'),
  titleBadge: z.string().default('CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM'),
  dateHighlight: z.string().default('20 • 10'),
  mainWish: z
    .string()
    .default(
      'Chúc bạn luôn rạng rỡ, bình an trong tâm hồn và được yêu thương theo cách trọn vẹn nhất.'
    ),
  subWish: z.string().default("Happy Vietnamese Women's Day ✨"),
});

export type HolidayConfig = z.infer<typeof holidayConfigSchema>;
