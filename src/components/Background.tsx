import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { LanguageConfig } from '../utils/languageTheme';

interface BackgroundProps {
  languageConfig: LanguageConfig;
}

export const Background: React.FC<BackgroundProps> = ({ languageConfig }) => {
  const frame = useCurrentFrame();

  // Floating ambient light orbs
  const orb1Y = interpolate(frame, [0, 150, 300], [0, 60, 0]);
  const orb1X = interpolate(frame, [0, 150, 300], [0, -40, 0]);
  const orb2Y = interpolate(frame, [0, 150, 300], [0, -80, 0]);
  const orb2X = interpolate(frame, [0, 150, 300], [0, 50, 0]);
  const orbPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1.15]);

  // Audio spectrum visualizer bars at the bottom
  const barCount = 32;
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Deterministic procedural wave height
    const wave = Math.sin(frame * 0.15 + i * 0.35) * 0.5 + 0.5;
    const wave2 = Math.cos(frame * 0.08 - i * 0.2) * 0.5 + 0.5;
    const height = 15 + (wave * 0.6 + wave2 * 0.4) * 85;
    return height;
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#07080f',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Subtle Matrix Dot Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          opacity: 0.65,
        }}
      />

      {/* Top Language Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: -200 + orb1Y,
          left: -100 + orb1X,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: languageConfig.glowColor,
          filter: 'blur(160px)',
          opacity: 0.35 * orbPulse,
          pointerEvents: 'none',
        }}
      />

      {/* Center-Right Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: 600 + orb2Y,
          right: -150 + orb2X,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.35)', // Indigo
          filter: 'blur(170px)',
          opacity: 0.3 * orbPulse,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom Emerald/Cyan Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: 150,
          width: 750,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.25)', // Emerald
          filter: 'blur(160px)',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* Modern Vignette Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 45%, transparent 40%, rgba(5, 6, 12, 0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Animated Bottom Audio Visualizer */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 12,
          opacity: 0.3,
          paddingLeft: 60,
          paddingRight: 60,
          pointerEvents: 'none',
        }}
      >
        {bars.map((h, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${h}px`,
              background: `linear-gradient(to top, ${languageConfig.primaryColor}, transparent)`,
              borderRadius: '4px',
            }}
          />
        ))}
      </div>
    </div>
  );
};
