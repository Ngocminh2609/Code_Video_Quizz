import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { random } from 'remotion';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const countdownDir = path.join(projectRoot, 'public', 'audio', 'countdown');
const successDir = path.join(projectRoot, 'public', 'audio', 'success');

fs.mkdirSync(countdownDir, { recursive: true });
fs.mkdirSync(successDir, { recursive: true });

function createWavBuffer(sampleRate, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = Math.round(s < 0 ? s * 32768 : s * 32767);
    const clamped = Math.max(-32768, Math.min(32767, intSample));
    buffer.writeInt16LE(clamped, 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;

// 1. Classic Clock: 6 seconds, ticks at 0s, 1s, 2s, 3s, 4s, 4.5s, 5s, 5.5s (speeds up at the end!)
function generateClassicTick() {
  const duration = 6.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  const tickTimes = [0.0, 1.0, 2.0, 3.0, 4.0, 4.5, 5.0, 5.3, 5.6];
  tickTimes.forEach((time, idx) => {
    const isTock = idx % 2 === 1;
    const startSample = Math.floor(time * sampleRate);
    const clickDuration = 0.08; // 80ms
    const clickSamples = Math.floor(clickDuration * sampleRate);

    const freq = isTock ? 850 : 1200;
    const woodFreq = isTock ? 400 : 550;

    for (let i = 0; i < clickSamples && startSample + i < totalSamples; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * 60); // sharp decay
      const noise = (random(null) * 2 - 1) * 0.15 * Math.exp(-t * 120);
      const tone = Math.sin(2 * Math.PI * freq * t) * 0.5 + Math.sin(2 * Math.PI * woodFreq * t) * 0.35;
      samples[startSample + i] += (tone + noise) * env * 0.8;
    }
  });

  return createWavBuffer(sampleRate, samples);
}

// 2. Digital Cyberpunk Beep Countdown: 6 seconds
function generateDigitalTick() {
  const duration = 6.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  const beeps = [
    { t: 0.0, freq: 880, dur: 0.1 },
    { t: 1.0, freq: 880, dur: 0.1 },
    { t: 2.0, freq: 880, dur: 0.1 },
    { t: 3.0, freq: 988, dur: 0.12 },
    { t: 4.0, freq: 1046, dur: 0.12 },
    { t: 4.5, freq: 1174, dur: 0.1 },
    { t: 5.0, freq: 1318, dur: 0.1 },
    { t: 5.3, freq: 1396, dur: 0.1 },
    { t: 5.6, freq: 1568, dur: 0.18 },
  ];

  beeps.forEach(({ t, freq, dur }) => {
    const start = Math.floor(t * sampleRate);
    const length = Math.floor(dur * sampleRate);
    for (let i = 0; i < length && start + i < totalSamples; i++) {
      const time = i / sampleRate;
      const env = Math.sin((Math.PI * i) / length); // smooth window
      // Sine wave with slight modulation
      const s = Math.sin(2 * Math.PI * freq * time) * 0.7 + Math.sin(4 * Math.PI * freq * time) * 0.2;
      samples[start + i] += s * env * 0.75;
    }
  });

  return createWavBuffer(sampleRate, samples);
}

// 3. Tense Percussive Thud + Click: 6 seconds
function generateTenseTick() {
  const duration = 6.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  const beats = [0.0, 1.0, 2.0, 3.0, 3.8, 4.4, 4.9, 5.3, 5.6];
  beats.forEach((t, idx) => {
    const start = Math.floor(t * sampleRate);
    const length = Math.floor(0.18 * sampleRate);
    const pitch = 120 + idx * 25; // pitch goes up over time
    for (let i = 0; i < length && start + i < totalSamples; i++) {
      const time = i / sampleRate;
      const env = Math.exp(-time * 25);
      // Kick / thud
      const thud = Math.sin(2 * Math.PI * (pitch * (1 - time * 3)) * time);
      // High click
      const click = (random(null) * 2 - 1) * Math.exp(-time * 80) * 0.4;
      samples[start + i] += (thud * 0.7 + click) * env * 0.85;
    }
  });

  return createWavBuffer(sampleRate, samples);
}

// 4. Bell Chime (Crystal Success Ding): 2.8 seconds
function generateBellChime() {
  const duration = 2.8;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Arpeggio into shining chord: E6 (1318.5), G#6 (1661.2), B6 (1975.5), E7 (2637)
  const notes = [
    { t: 0.0, freq: 1318.5, vol: 0.5 },
    { t: 0.08, freq: 1661.2, vol: 0.6 },
    { t: 0.16, freq: 1975.5, vol: 0.7 },
    { t: 0.24, freq: 2637.0, vol: 0.9 },
  ];

  notes.forEach(({ t, freq, vol }) => {
    const start = Math.floor(t * sampleRate);
    const length = totalSamples - start;
    for (let i = 0; i < length; i++) {
      const time = i / sampleRate;
      const env = Math.exp(-time * 2.5); // long reverberant decay
      // Pure bell harmonics: f, 2f, 3f
      const s = Math.sin(2 * Math.PI * freq * time) * 0.7 +
                Math.sin(2 * Math.PI * freq * 2.02 * time) * 0.2 +
                Math.sin(2 * Math.PI * freq * 3.01 * time) * 0.1;
      samples[start + i] += s * env * vol * 0.4;
    }
  });

  return createWavBuffer(sampleRate, samples);
}

// 5. Brass Fanfare (Victory / Triumphant Chord): 2.5 seconds
function generateBrassFanfare() {
  const duration = 2.5;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Short fanfare melody: C5 -> E5 -> G5 -> Hold High C6
  const notes = [
    { t: 0.0, freq: 523.25, dur: 0.12, vol: 0.5 },
    { t: 0.12, freq: 659.25, dur: 0.12, vol: 0.6 },
    { t: 0.24, freq: 783.99, dur: 0.15, vol: 0.7 },
    { t: 0.39, freq: 1046.5, dur: 2.0, vol: 0.9 }, // High C
    { t: 0.39, freq: 1318.5, dur: 2.0, vol: 0.6 }, // High E harmony
    { t: 0.39, freq: 1567.98, dur: 2.0, vol: 0.5 }, // High G harmony
  ];

  notes.forEach(({ t, freq, dur, vol }) => {
    const start = Math.floor(t * sampleRate);
    const length = Math.min(Math.floor(dur * sampleRate), totalSamples - start);
    for (let i = 0; i < length; i++) {
      const time = i / sampleRate;
      const env = Math.exp(-time * (dur > 1 ? 1.8 : 8));
      // Rich brass-like warm tone (fundamental + odd/even harmonics)
      const s = Math.sin(2 * Math.PI * freq * time) * 0.5 +
                Math.sin(4 * Math.PI * freq * time) * 0.25 +
                Math.sin(6 * Math.PI * freq * time) * 0.15 +
                Math.sin(8 * Math.PI * freq * time) * 0.1;
      samples[start + i] += s * env * vol * 0.45;
    }
  });

  return createWavBuffer(sampleRate, samples);
}

// 6. Arcade Level Up (Retro 8-bit celebratory sound): 2.0 seconds
function generateArcadeLevelUp() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Rapid ascending 8-bit scale
  const freqs = [392, 523, 659, 784, 1046, 1318, 1568, 2093];
  const stepTime = 0.06;

  freqs.forEach((freq, idx) => {
    const t = idx * stepTime;
    const start = Math.floor(t * sampleRate);
    const isLast = idx === freqs.length - 1;
    const dur = isLast ? 1.2 : stepTime;
    const length = Math.min(Math.floor(dur * sampleRate), totalSamples - start);

    for (let i = 0; i < length; i++) {
      const time = i / sampleRate;
      const env = isLast ? Math.exp(-time * 3) : Math.sin((Math.PI * i) / length);
      // Bright pulse wave (50% square wave)
      const phase = (freq * time) % 1;
      const pulse = phase < 0.5 ? 0.6 : -0.6;
      samples[start + i] += pulse * env * 0.4;
    }
  });

  return createWavBuffer(sampleRate, samples);
}

// 7a. Còi Hú Khẩn Cấp Siren (Emergency Siren Wail)
function generateWarningSiren() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Rapid oscillating siren between 600Hz and 1150Hz (3.5 cycles per sec)
    const freq = 850 + 280 * Math.sin(2 * Math.PI * 3.5 * t);
    const phase = 2 * Math.PI * freq * t;
    const s = Math.sin(phase) * 0.75 + Math.sin(phase * 2) * 0.2;
    const env = Math.min(1, t * 15) * Math.min(1, (duration - t) * 4);
    samples[i] = s * env * 0.6;
  }
  return createWavBuffer(sampleRate, samples);
}

// 7b. Còi Buzzer Nguy Hiểm Công Nghiệp (Hazard Warning Buzzer)
function generateWarningBuzzer() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  const burstTimes = [0.0, 0.45, 0.9, 1.35];
  const burstDuration = 0.35;

  burstTimes.forEach((startSec) => {
    const startIdx = Math.floor(startSec * sampleRate);
    const burstLen = Math.floor(burstDuration * sampleRate);
    for (let i = 0; i < burstLen && startIdx + i < totalSamples; i++) {
      const t = i / sampleRate;
      // Dissonant dual frequency buzz: 420Hz + 466Hz (tritone/minor 2nd danger clash)
      const s1 = Math.sin(2 * Math.PI * 420 * t);
      const s2 = Math.sin(2 * Math.PI * 466 * t);
      // Hard clip to create an industrial electric buzzer timbre
      const raw = (s1 + s2) * 1.5;
      const clipped = Math.max(-0.8, Math.min(0.8, raw));
      const env = Math.sin((Math.PI * i) / burstLen);
      samples[startIdx + i] += clipped * env * 0.5;
    }
  });
  return createWavBuffer(sampleRate, samples);
}

// 7c. Cảnh Báo Lỗi Glitch Cyberpunk (Cyber Glitch Danger Alert)
function generateWarningGlitch() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Step-wise digital FM glitch chirps
    const step = Math.floor(t * 12);
    const baseFreq = 400 + ((step * 173) % 800);
    const fm = Math.sin(2 * Math.PI * 80 * t) * 120;
    const phase = 2 * Math.PI * (baseFreq + fm) * t;
    const pulse = (phase % (2 * Math.PI)) < Math.PI ? 0.7 : -0.7;
    const env = Math.exp(-((t * 6) % 1) * 3);
    samples[i] = pulse * env * 0.45;
  }
  return createWavBuffer(sampleRate, samples);
}

// 7d. Còi Báo Động Hạt Nhân Nguy Cấp (Nuclear Meltdown Alarm)
function generateWarningNuclear() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  // 2 heavy sweeping wails (1.0s each)
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const cycle = (t % 1.0) / 1.0;
    // Sweeps from 950Hz down to 480Hz
    const freq = 950 - 470 * cycle;
    const phase = 2 * Math.PI * freq * t;
    const s = Math.sin(phase) * 0.8 + Math.sin(phase * 3) * 0.15;
    const env = Math.sin(Math.PI * cycle);
    samples[i] = s * env * 0.58;
  }
  return createWavBuffer(sampleRate, samples);
}

// 7e. Radar Cảnh Báo Nguy Hiểm Cao (High Ping Sonar Radar Alert)
function generateWarningRadar() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  const pings = [0.0, 0.5, 1.0, 1.5];
  pings.forEach((p) => {
    const startIdx = Math.floor(p * sampleRate);
    const pingLen = Math.floor(0.4 * sampleRate);
    for (let i = 0; i < pingLen && startIdx + i < totalSamples; i++) {
      const t = i / sampleRate;
      const freq = 1350 + Math.exp(-t * 20) * 400;
      const s = Math.sin(2 * Math.PI * freq * t);
      const env = Math.exp(-t * 8);
      samples[startIdx + i] += s * env * 0.65;
    }
  });
  return createWavBuffer(sampleRate, samples);
}

/**
 * Generate and write all required audio sound effects to public/audio/
 */
export function generateAllAudio(quiet = false) {
  if (!fs.existsSync(countdownDir)) {
    fs.mkdirSync(countdownDir, { recursive: true });
  }
  if (!fs.existsSync(successDir)) {
    fs.mkdirSync(successDir, { recursive: true });
  }
  const audioDir = path.join(projectRoot, 'public', 'audio');
  const warningDir = path.join(audioDir, 'warning');
  if (!fs.existsSync(warningDir)) {
    fs.mkdirSync(warningDir, { recursive: true });
  }

  if (!quiet) console.log('🎵 Đang khởi tạo các tệp âm thanh hiệu ứng...');

  // 1. Còi báo động khẩn cấp mặc định
  const warningSiren = generateWarningSiren();
  const warningBuzzer = generateWarningBuzzer();
  const warningGlitch = generateWarningGlitch();
  const warningNuclear = generateWarningNuclear();
  const warningRadar = generateWarningRadar();

  fs.writeFileSync(path.join(audioDir, 'warning-sfx.mp3'), warningSiren);
  fs.writeFileSync(path.join(audioDir, 'warning-sfx.wav'), warningSiren);

  // 2. Bộ 5 âm thanh cảnh báo nguy hiểm Pixabay Danger Alert
  fs.writeFileSync(path.join(warningDir, 'warning-siren.wav'), warningSiren);
  fs.writeFileSync(path.join(warningDir, 'warning-buzzer.wav'), warningBuzzer);
  fs.writeFileSync(path.join(warningDir, 'warning-glitch.wav'), warningGlitch);
  fs.writeFileSync(path.join(warningDir, 'warning-nuclear.wav'), warningNuclear);
  fs.writeFileSync(path.join(warningDir, 'warning-radar.wav'), warningRadar);
  if (!quiet) console.log('   ✔ public/audio/warning/ (5 âm thanh cảnh báo nguy hiểm đa dạng)');

  fs.writeFileSync(path.join(countdownDir, 'tick-classic.wav'), generateClassicTick());
  if (!quiet) console.log('   ✔ public/audio/countdown/tick-classic.wav');

  fs.writeFileSync(path.join(countdownDir, 'tick-digital.wav'), generateDigitalTick());
  if (!quiet) console.log('   ✔ public/audio/countdown/tick-digital.wav');

  fs.writeFileSync(path.join(countdownDir, 'tick-tense.wav'), generateTenseTick());
  if (!quiet) console.log('   ✔ public/audio/countdown/tick-tense.wav');

  fs.writeFileSync(path.join(successDir, 'bell-chime.wav'), generateBellChime());
  if (!quiet) console.log('   ✔ public/audio/success/bell-chime.wav');

  fs.writeFileSync(path.join(successDir, 'brass-fanfare.wav'), generateBrassFanfare());
  if (!quiet) console.log('   ✔ public/audio/success/brass-fanfare.wav');

  fs.writeFileSync(path.join(successDir, 'arcade-levelup.wav'), generateArcadeLevelUp());
  if (!quiet) console.log('   ✔ public/audio/success/arcade-levelup.wav');

  if (!quiet) console.log('✨ Khởi tạo thành công toàn bộ hiệu ứng âm thanh!\n');
}

// Run directly when called via `node scripts/generateAudio.mjs`
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  generateAllAudio();
}
