/**
 * Lightweight notification sounds built with the Web Audio API.
 * No audio asset is required, and the audio context is reused so the
 * sound can fire instantly when a new order arrives.
 */

let audioContext: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

/** Resume the audio context after a user gesture (browser autoplay policy). */
export function primeNotificationSound() {
  const ctx = getAudioContext();
  if (ctx?.state === 'suspended') {
    void ctx.resume();
  }
}

export function isNotificationSoundEnabled() {
  return soundEnabled;
}

export function setNotificationSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (enabled) primeNotificationSound();
}

function scheduleChime(ctx: AudioContext) {
  const start = ctx.currentTime + 0.02;
  const notes = [
    { frequency: 880, offset: 0 },
    { frequency: 1108.73, offset: 0.18 },
    { frequency: 880, offset: 0.52 },
    { frequency: 1108.73, offset: 0.7 },
  ];

  notes.forEach(({ frequency, offset }) => {
    const at = start + offset;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, at);

    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(at);
    oscillator.stop(at + 0.34);
  });
}

/** Play the "new order" chime if notification sound is enabled. */
export function playNewOrderSound() {
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx
      .resume()
      .then(() => scheduleChime(ctx))
      .catch(() => {
        /* Audio is blocked until the user interacts with the page. */
      });
    return;
  }

  scheduleChime(ctx);
}
