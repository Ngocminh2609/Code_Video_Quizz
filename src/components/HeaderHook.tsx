import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LanguageConfig } from '../utils/languageTheme';

interface HeaderHookProps {
  hookTitle: string;
  difficulty?: string;
  category?: string;
  languageConfig: LanguageConfig;
}

export const HeaderHook: React.FC<HeaderHookProps> = ({
  hookTitle,
  difficulty = 'CƠ BẢN',
  category,
  languageConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance from top
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
      mass: 0.8,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [-80, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle breathing pulse
  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 36px',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      {/* Top Badges Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(239, 68, 68, 0.22)',
            border: '1.5px solid rgba(239, 68, 68, 0.55)',
            color: '#fca5a5',
            padding: '8px 20px',
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
          }}
        >
          <span style={{ fontSize: 24 }}>🔥</span>
          <span>BẪY LẬP TRÌNH</span>
        </div>

        {difficulty && (
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              color: '#fcd34d',
              padding: '8px 20px',
              borderRadius: 9999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            ĐỘ KHÓ: {difficulty}
          </div>
        )}
      </div>

      {/* Main Hook Title in Pure Vietnamese */}
      <div
        style={{
          transform: `scale(${pulse})`,
          maxWidth: 960,
          marginBottom: 18,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 4px 28px rgba(0,0,0,0.85)',
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

      {/* Language & Category Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Language Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(30, 41, 59, 0.9)',
            border: `1.5px solid ${languageConfig.primaryColor}`,
            boxShadow: `0 0 18px ${languageConfig.glowColor}`,
            padding: '8px 24px',
            borderRadius: 14,
            fontSize: 22,
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
              padding: '8px 22px',
              borderRadius: 14,
              fontSize: 21,
              fontWeight: 700,
              color: '#cbd5e1',
            }}
          >
            📂 {category}
          </div>
        )}
      </div>
    </div>
  );
};
