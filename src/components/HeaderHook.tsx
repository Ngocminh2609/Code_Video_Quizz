import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LanguageConfig } from '../utils/languageTheme';

interface HeaderHookProps {
  hookTitle: string;
  warningHookText?: string;
  difficulty?: string;
  category?: string;
  languageConfig: LanguageConfig;
}

export const HeaderHook: React.FC<HeaderHookProps> = ({
  hookTitle,
  warningHookText = '⚠️ 90% DEVELOPER LÂU NĂM SẼ TRẢ LỜI SAI CÂU NÀY!',
  difficulty = 'CƠ BẢN',
  category,
  languageConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Giai đoạn 1: 0s - 1.2s (Frames 0 - 36) -> Giật nảy spring mạnh mẽ ở giữa
  const warningSpring = spring({
    frame,
    fps,
    config: {
      damping: 11,
      stiffness: 140,
      mass: 0.9,
    },
  });

  // 2. Giai đoạn chuyển tiếp 1.2s - 2s (Frames 36 - 60) -> Thu nhỏ & neo lên vị trí header
  const dockProgress = interpolate(frame, [36, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tọa độ Y: từ vị trí trung tâm (khoảng 310px) trượt lên vị trí header (0px)
  const bannerY = interpolate(dockProgress, [0, 1], [310, 0]);

  // Scale: từ giật nảy 1.1 ở giữa thu nhỏ về 1.0 ở header
  const initialScale = interpolate(warningSpring, [0, 1], [0.75, 1.1]);
  const bannerScale = interpolate(dockProgress, [0, 1], [initialScale, 1.0]);

  // Pulse viền đỏ neon
  const pulseRed = 1 + Math.sin(frame * 0.25) * 0.03;
  const shadowSpread = 20 + Math.sin(frame * 0.25) * 12;

  // Header content fade-in sau khi banner neo lên (frame 45+)
  const secondaryContentOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cleanWarningText = warningHookText.replace(/^(?:⚠️|\s)+/u, '').trim();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 32px',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 40,
        position: 'relative',
      }}
    >
      {/* 🔹 Hook Cảnh Báo Đỏ (Warning Overlay / Header Banner) */}
      <div
        style={{
          transform: `translateY(${bannerY}px) scale(${bannerScale * (frame < 36 ? pulseRed : 1)})`,
          width: frame < 36 ? '95%' : '100%',
          maxWidth: 960,
          zIndex: 50,
        }}
      >
        <div
          style={{
            backgroundColor: frame < 36 ? 'rgba(239, 68, 68, 0.96)' : 'rgba(239, 68, 68, 0.22)',
            border: '2.5px solid #EF4444',
            color: frame < 36 ? '#ffffff' : '#fca5a5',
            padding: frame < 36 ? '18px 26px' : '10px 24px',
            borderRadius: frame < 36 ? 26 : 9999,
            fontSize: frame < 36 ? 31 : 22,
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: `0 12px 35px rgba(0, 0, 0, 0.7), 0 0 ${shadowSpread}px rgba(239, 68, 68, 0.75)`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: frame < 36 ? 38 : 26 }}>⚠️</span>
          <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            {cleanWarningText}
          </span>
        </div>
      </div>

      {/* 🔹 Nội dung tiêu đề câu hỏi & Badges (Xuất hiện mượt mà khi banner neo lên header) */}
      <div
        style={{
          opacity: secondaryContentOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: 14,
        }}
      >
        {/* Badges Phụ: Độ khó & Thể loại */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
          }}
        >
          {difficulty && (
            <div
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                border: '1.5px solid rgba(245, 158, 11, 0.55)',
                color: '#fcd34d',
                padding: '6px 18px',
                borderRadius: 9999,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              ĐỘ KHÓ: {difficulty}
            </div>
          )}

          {/* Ngôn ngữ Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(30, 41, 59, 0.9)',
              border: `1.5px solid ${languageConfig.primaryColor}`,
              boxShadow: `0 0 16px ${languageConfig.glowColor}`,
              padding: '6px 20px',
              borderRadius: 9999,
              fontSize: 20,
              fontWeight: 800,
              color: '#f8fafc',
            }}
          >
            <span>{languageConfig.badge}</span>
          </div>

          {category && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '6px 18px',
                borderRadius: 9999,
                fontSize: 19,
                fontWeight: 700,
                color: '#cbd5e1',
              }}
            >
              📂 {category}
            </div>
          )}
        </div>

        {/* Tiêu đề ngắn gọn của Hook */}
        <div style={{ maxWidth: 960 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0,0,0,0.85)',
            }}
          >
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 40%, ${languageConfig.primaryColor} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              {hookTitle}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};
