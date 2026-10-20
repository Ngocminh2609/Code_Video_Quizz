import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { interpolate, useCurrentFrame } from 'remotion';
import { Prism } from '../utils/prismSetup';
import { LanguageConfig } from '../utils/languageTheme';

interface CodeCardProps {
  code: string;
  languageConfig: LanguageConfig;
}

export const CodeCard: React.FC<CodeCardProps> = ({ code, languageConfig }) => {
  const frame = useCurrentFrame();

  // Khung code xuất hiện ngầm từ frame 0 để người xem quét đề bài ngay
  // Từ 1.2s - 2s (frame 36 - 60): làm sáng 100% khối code
  const brightness = interpolate(frame, [36, 60], [0.65, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const codeOpacity = interpolate(frame, [0, 10, 36, 60], [0.55, 0.65, 0.65, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [36, 60], [0.97, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Clean code string
  const trimmedCode = code.trim();

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity: codeOpacity,
        filter: `brightness(${brightness})`,
        width: '92%',
        margin: '0 auto',
        zIndex: 10,
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          boxShadow: `0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px ${languageConfig.glowColor.replace('0.5', '0.22')}`,
        }}
      >
        {/* macOS Terminal Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Mac Traffic Light Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#ff5f56',
                boxShadow: '0 0 8px rgba(255, 95, 86, 0.6)',
              }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#ffbd2e',
                boxShadow: '0 0 8px rgba(255, 189, 46, 0.6)',
              }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#27c93f',
                boxShadow: '0 0 8px rgba(39, 201, 63, 0.6)',
              }}
            />
          </div>

          {/* Filename Tab */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              padding: '6px 18px',
              borderRadius: 8,
              fontSize: 20,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ color: languageConfig.primaryColor }}>●</span>
            <span>{languageConfig.filename}</span>
          </div>

          {/* Encoding Tag */}
          <div
            style={{
              fontSize: 18,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: languageConfig.primaryColor,
              letterSpacing: '0.05em',
            }}
          >
            UTF-8
          </div>
        </div>

        {/* Code Content Area with Syntax Highlighting */}
        <div
          style={{
            padding: '28px 26px',
            backgroundColor: 'rgba(11, 15, 25, 0.95)',
          }}
        >
          <Highlight
            prism={Prism}
            theme={themes.dracula}
            code={trimmedCode}
            language={languageConfig.prismLang}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} font-code`}
                style={{
                  ...style,
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'transparent',
                  fontSize: 32,
                  lineHeight: 1.6,
                  overflowX: 'hidden',
                  fontWeight: 500,
                }}
              >
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <div
                      key={i}
                      {...lineProps}
                      style={{
                        ...lineProps.style,
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Line Number */}
                      <span
                        style={{
                          width: 44,
                          display: 'inline-block',
                          color: '#475569',
                          textAlign: 'right',
                          paddingRight: 24,
                          userSelect: 'none',
                          fontSize: 26,
                          fontWeight: 500,
                        }}
                      >
                        {i + 1}
                      </span>

                      {/* Code Content */}
                      <span
                        style={{
                          flex: 1,
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </div>
  );
};
