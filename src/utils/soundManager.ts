/**
 * Sound Manager: Manages sound effects for Quiz Videos
 * Provides deterministic randomization per quiz (or manual override via quiz fields)
 */

export interface SoundConfig {
  id: string;
  name: string;
  file: string;
  volume: number;
}

export const COUNTDOWN_SOUNDS: SoundConfig[] = [
  {
    id: 'classic-clock',
    name: 'Đồng Hồ Tích Tắc Cổ Điển',
    file: 'audio/countdown/tick-classic.wav',
    volume: 0.75,
  },
  {
    id: 'digital-beep',
    name: 'Cyberpunk Đếm Ngược Số',
    file: 'audio/countdown/tick-digital.wav',
    volume: 0.65,
  },
  {
    id: 'tense-heartbeat',
    name: 'Nhịp Tim Căng Thẳng Hồi Hộp',
    file: 'audio/countdown/tick-tense.wav',
    volume: 0.8,
  },
];

export const SUCCESS_SOUNDS: SoundConfig[] = [
  {
    id: 'crystal-chime',
    name: 'Chuông Ngân Pha Lê Ting',
    file: 'audio/success/bell-chime.wav',
    volume: 0.85,
  },
  {
    id: 'victory-fanfare',
    name: 'Kèn Fanfare Chiến Thắng',
    file: 'audio/success/brass-fanfare.wav',
    volume: 0.75,
  },
  {
    id: 'arcade-levelup',
    name: 'Game 8-Bit Level Up',
    file: 'audio/success/arcade-levelup.wav',
    volume: 0.7,
  },
];

export const WARNING_SOUNDS: SoundConfig[] = [
  {
    id: 'warning-siren',
    name: 'Còi Hú Khẩn Cấp Siren',
    file: 'audio/warning/warning-siren.wav',
    volume: 0.85,
  },
  {
    id: 'warning-buzzer',
    name: 'Còi Buzzer Nguy Hiểm Công Nghiệp',
    file: 'audio/warning/warning-buzzer.wav',
    volume: 0.8,
  },
  {
    id: 'warning-nuclear',
    name: 'Còi Báo Động Hạt Nhân Nguy Cấp',
    file: 'audio/warning/warning-nuclear.wav',
    volume: 0.85,
  },
  {
    id: 'warning-glitch',
    name: 'Cảnh Báo Lỗi Glitch Cyberpunk',
    file: 'audio/warning/warning-glitch.wav',
    volume: 0.75,
  },
  {
    id: 'warning-radar',
    name: 'Radar Cảnh Báo Nguy Hiểm Cao',
    file: 'audio/warning/warning-radar.wav',
    volume: 0.8,
  },
];

/**
 * Simple string hash function to reliably map a quiz ID to sound indices
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns sound effects for a given quiz ID.
 * Ensures consistent, deterministic audio per quiz while providing variety across different quizzes.
 */
export function getSoundForQuiz(
  quizId: string,
  overrideCountdown?: string,
  overrideSuccess?: string,
  overrideWarning?: string
): {
  countdownSound: SoundConfig;
  successSound: SoundConfig;
  warningSound: SoundConfig;
} {
  const hash = hashString(quizId || 'default');

  // Pick deterministic countdown sound
  const countdownIndex = hash % COUNTDOWN_SOUNDS.length;
  const countdownSound = overrideCountdown
    ? COUNTDOWN_SOUNDS.find((s) => s.id === overrideCountdown || s.file === overrideCountdown) ||
      COUNTDOWN_SOUNDS[countdownIndex]
    : COUNTDOWN_SOUNDS[countdownIndex];

  // Pick deterministic success sound (offset by 1)
  const successIndex = (hash + 1) % SUCCESS_SOUNDS.length;
  const successSound = overrideSuccess
    ? SUCCESS_SOUNDS.find((s) => s.id === overrideSuccess || s.file === overrideSuccess) ||
      SUCCESS_SOUNDS[successIndex]
    : SUCCESS_SOUNDS[successIndex];

  // Pick deterministic/random danger warning sound per quiz (offset by 2)
  const warningIndex = (hash + 2) % WARNING_SOUNDS.length;
  const warningSound = overrideWarning
    ? WARNING_SOUNDS.find((s) => s.id === overrideWarning || s.file === overrideWarning) || {
        id: 'custom-warning',
        name: 'Âm Thanh Cảnh Báo Tùy Biến',
        file: overrideWarning,
        volume: 0.8,
      }
    : WARNING_SOUNDS[warningIndex];

  return {
    countdownSound,
    successSound,
    warningSound,
  };
}
