import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface HolidayGreetingTextProps {
  titleBadge?: string;
  dateHighlight?: string;
  mainWish?: string;
}

export const HolidayGreetingText: React.FC<HolidayGreetingTextProps> = ({
  titleBadge = 'CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM',
  dateHighlight = '20 • 10',
  mainWish = 'Chúc bạn luôn rạng rỡ, bình an trong tâm hồn và được yêu thương theo cách trọn vẹn nhất.',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Hiệu ứng trượt và fade-in cho Tiêu đề trên cùng (frame 10 - 45)
  const titleSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 60 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [-40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // 2. Hiệu ứng cho Câu chúc chính (frame 40 - 85)
  const wishSpring = spring({
    frame: Math.max(0, frame - 38),
    fps,
    config: { damping: 15, stiffness: 50 },
  });
  const wishY = interpolate(wishSpring, [0, 1], [40, 0]);
  const wishOpacity = interpolate(wishSpring, [0, 1], [0, 1]);

  // 3. Hiệu ứng lấp lánh mạ vàng (Gold Glow Pulse)
  const goldPulse = 18 + Math.sin(frame * 0.08) * 8;
  const shimmerPos = (frame * 3) % 400;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '110px 60px 140px 60px',
        boxSizing: 'border-box',
        zIndex: 30,
        pointerEvents: 'none',
        fontFamily: "'Be Vietnam Pro', 'Playfair Display', -apple-system, sans-serif",
      }}
    >
      {/* 👑 KHỐI TIÊU ĐỀ TRÊN CÙNG */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 14,
        }}
      >
        {/* Huy hiệu trang trọng */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 28px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.28) 0%, rgba(245, 158, 11, 0.22) 100%)',
            border: '1.5px solid rgba(251, 191, 36, 0.55)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 25px rgba(245, 158, 11, 0.3)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <span style={{ color: '#fbbf24', fontSize: 20 }}>✨</span>
          <span
            style={{
              color: '#fef3c7',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {titleBadge}
          </span>
          <span style={{ color: '#fbbf24', fontSize: 20 }}>✨</span>
        </div>

        {/* Số 20 • 10 mạ vàng kim phát sáng rực rỡ */}
        <h1
          style={{
            margin: 0,
            fontSize: 78,
            fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 25%, #F59E0B 50%, #D97706 75%, #FEF3C7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 4px 12px rgba(245, 158, 11, 0.7)) drop-shadow(0 0 ${goldPulse}px rgba(217, 119, 6, 0.55))`,
          }}
        >
          {dateHighlight}
        </h1>
      </div>

      {/* 📜 KHỐI CÂU CHÚC CHÍNH BÊN DƯỚI HOA HỒNG */}
      <div
        style={{
          transform: `translateY(${wishY}px)`,
          opacity: wishOpacity,
          width: '100%',
          maxWidth: 960,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '42px 48px',
          borderRadius: 36,
          background: 'linear-gradient(180deg, rgba(24, 12, 38, 0.82) 0%, rgba(13, 6, 24, 0.92) 100%)',
          border: '1.5px solid rgba(251, 191, 36, 0.4)',
          boxShadow: `0 24px 60px rgba(0, 0, 0, 0.7), 0 0 ${goldPulse + 10}px rgba(245, 158, 11, 0.25)`,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ánh kim quét ngang nhẹ (Shimmer line) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: -200 + shimmerPos * 3.5,
            width: 160,
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(254, 240, 138, 0.15) 50%, transparent 100%)',
            transform: 'skewX(-25deg)',
            pointerEvents: 'none',
          }}
        />

        {/* Dấu ngoặc kép trang trí vàng kim */}
        <div
          style={{
            fontSize: 48,
            lineHeight: 1,
            color: '#fbbf24',
            opacity: 0.85,
            marginBottom: 8,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          ❝
        </div>

        {/* Nội dung câu chúc tiếng Việt mạ vàng */}
        <p
          style={{
            margin: '0 0 16px 0',
            fontSize: 35,
            lineHeight: 1.55,
            fontWeight: 600,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#fffbeb',
            background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 30%, #fde68a 70%, #fcd34d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 18px rgba(245, 158, 11, 0.4))',
          }}
        >
          {mainWish}
        </p>

        {/* Dải phân cách hoa văn họa tiết */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '60%', justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.6))' }} />
          <span style={{ color: '#fbbf24', fontSize: 16 }}>✦ 💖 ✦</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.6), transparent)' }} />
        </div>
      </div>
    </div>
  );
};
