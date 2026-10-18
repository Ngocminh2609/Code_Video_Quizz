import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LanguageConfig } from '../utils/languageTheme';

interface HeaderHookProps {
  hookTitle: string;
  hookTitleVi?: string;
  difficulty?: string;
  difficultyVi?: string;
  category?: string;
  categoryVi?: string;
  languageConfig: LanguageConfig;
}

export const HeaderHook: React.FC<HeaderHookProps> = ({
  hookTitle,
  hookTitleVi,
  difficulty = 'HARD',
  difficultyVi,
  category,
  categoryVi,
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

  // Subtle breathing scale pulse on hook title
  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;

  const difficultyText = difficultyVi ? `${difficulty} • ${difficultyVi}` : difficulty;
  const categoryText = categoryVi ? `${category} • ${categoryVi}` : category;

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
      {/* Top Badges Row (Bilingual) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(239, 68, 68, 0.22)',
            border: '1.5px solid rgba(239, 68, 68, 0.5)',
            color: '#fca5a5',
            padding: '7px 18px',
            borderRadius: 9999,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
          }}
        >
          <span style={{ fontSize: 22 }}>🔥</span>
          <span>DEV TRAP • BẪY LẬP TRÌNH</span>
        </div>

        {difficulty && (
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              border: '1.5px solid rgba(245, 158, 11, 0.45)',
              color: '#fcd34d',
              padding: '7px 18px',
              borderRadius: 9999,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {difficultyText}
          </div>
        )}
      </div>

      {/* Main Hook Title (Bilingual Stack) */}
      <div
        style={{
          transform: `scale(${pulse})`,
          maxWidth: 980,
          marginBottom: 16,
        }}
      >
        {/* English Hook Title */}
        <h1
          style={{
            margin: '0 0 6px 0',
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.16,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(0,0,0,0.7)',
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

        {/* Vietnamese Hook Sub-title */}
        {hookTitleVi && (
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: '#fde047', // Warm yellow for high contrast & attention
              textShadow: '0 2px 14px rgba(0,0,0,0.8), 0 0 20px rgba(253, 224, 71, 0.3)',
              lineHeight: 1.25,
            }}
          >
            🇻🇳 {hookTitleVi}
          </div>
        )}
      </div>

      {/* Language & Category Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
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
            background: 'rgba(30, 41, 59, 0.85)',
            border: `1.5px solid ${languageConfig.primaryColor}`,
            boxShadow: `0 0 16px ${languageConfig.glowColor}`,
            padding: '8px 22px',
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
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '8px 20px',
              borderRadius: 14,
              fontSize: 20,
              fontWeight: 600,
              color: '#cbd5e1',
            }}
          >
            📂 {categoryText}
          </div>
        )}
      </div>
    </div>
  );
};
