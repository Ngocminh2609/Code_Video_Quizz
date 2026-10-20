import React from 'react';
import { Audio, staticFile } from 'remotion';
import { HolidayBackground } from './components/HolidayBackground';
import { BloomingRose } from './components/BloomingRose';
import { CornerFireworks } from './components/CornerFireworks';
import { HolidayGreetingText } from './components/HolidayGreetingText';
import { HolidayConfig } from './types';

export const HolidayComposition: React.FC<HolidayConfig> = ({
  titleBadge,
  dateHighlight,
  mainWish,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: '#020108',
        overflow: 'hidden',
      }}
    >
      {/* 1. Nền chiều sâu Midnight Blue & Tím huyền ảo */}
      <HolidayBackground />

      {/* 2. Đóa hoa hồng đỏ phát sáng ở trung tâm */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <BloomingRose />
      </div>

      {/* 3. Hệ thống hạt pháo hoa liên tục từ 4 góc màn hình */}
      <CornerFireworks />

      {/* 4. Văn bản chúc mừng mạ vàng mượt mà */}
      <HolidayGreetingText
        titleBadge={titleBadge}
        dateHighlight={dateHighlight}
        mainWish={mainWish}
      />

      {/* 5. Hiệu ứng âm thanh chuông ngân pha lê êm ái */}
      <Audio
        src={staticFile('audio/success/bell-chime.wav')}
        volume={0.65}
        startFrom={0}
      />
    </div>
  );
};
