/**
 * SMARAN Web Audio Engine & Sound Synthesis
 * Plays procedural ambient nature soundscapes, gentle game chimes, tap clicks, and victory fanfares.
 * Guarantees zero sound leaks and clean cancellation.
 */

class SmaranAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.currentSoundId = null;
    this.activeNodes = [];
    this.intervalIds = [];
    this.autoStopTimer = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // Soft Tap Click
  playTapSound() {
    if (!SMARAN_STATE.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Soft Positive Chime on Match/Correct
  playSuccessChime() {
    if (!SMARAN_STATE.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch (e) {}
  }

  // Victory Celebration Fanfare
  playCelebrationFanfare() {
    if (!SMARAN_STATE.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.1;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + 1.3);
      });
    } catch (e) {}
  }

  // Procedural Environmental Audio - Complete Stop
  stopSound() {
    this.isPlaying = false;
    this.currentSoundId = null;
    SMARAN_STATE.isPlayingSoundscape = false;

    // Clear all recurring intervals
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];

    // Clear auto stop timeout
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }

    // Stop and disconnect all active Web Audio nodes
    this.activeNodes.forEach(node => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    // Update UI Indicators
    this.updateSoundUIState();
  }

  // Play Sound with Auto-Stop Safety
  playSound(soundId, autoStopSeconds = 12) {
    if (!SMARAN_STATE.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Toggle off if currently playing the exact same sound
    if (this.isPlaying && this.currentSoundId === soundId) {
      this.stopSound();
      return;
    }

    // Always stop previous sounds cleanly
    this.stopSound();

    this.isPlaying = true;
    this.currentSoundId = soundId;
    SMARAN_STATE.isPlayingSoundscape = true;
    this.updateSoundUIState();

    if (soundId === 'birds') {
      this.createGentleNoise(0.02, 300);
      const chirp = () => {
        if (!this.isPlaying || !this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const baseFreq = 2200 + Math.random() * 800;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq + 500, now + 0.08);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.07, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          osc.stop(now + 0.25);
          this.activeNodes.push(osc, gain);
        } catch (e) {}
      };

      chirp();
      const interval = setInterval(() => {
        if (!this.isPlaying) return;
        if (Math.random() > 0.3) chirp();
      }, 1400);
      this.intervalIds.push(interval);

    } else if (soundId === 'rain') {
      this.createGentleNoise(0.06, 600);
    } else if (soundId === 'river') {
      this.createGentleNoise(0.07, 380);
    } else if (soundId === 'wind') {
      this.createGentleNoise(0.04, 250);
    } else {
      this.createGentleNoise(0.05, 400);
    }

    // Automatic safety stop after configured duration (default 12 seconds)
    if (autoStopSeconds > 0) {
      this.autoStopTimer = setTimeout(() => {
        if (this.isPlaying && this.currentSoundId === soundId) {
          this.stopSound();
        }
      }, autoStopSeconds * 1000);
    }
  }

  createGentleNoise(volume, cutoffFreq) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoffFreq, this.ctx.currentTime);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      noiseSource.start();
      this.activeNodes.push(noiseSource, filter, gainNode);
    } catch (e) {}
  }

  updateSoundUIState() {
    const playBtns = document.querySelectorAll('.btn-sound-trigger');
    playBtns.forEach(btn => {
      const targetSound = btn.getAttribute('data-sound');
      if (this.isPlaying && this.currentSoundId === targetSound) {
        btn.classList.add('playing');
        btn.textContent = '⏹ Stop Sound';
      } else {
        btn.classList.remove('playing');
        if (btn.getAttribute('data-original-label')) {
          btn.textContent = btn.getAttribute('data-original-label');
        }
      }
    });

    const headerSoundIndicator = document.getElementById('headerSoundBtn');
    if (headerSoundIndicator) {
      if (this.isPlaying) {
        headerSoundIndicator.classList.add('active-playing');
        headerSoundIndicator.title = 'Sound Playing (Click to Stop)';
      } else {
        headerSoundIndicator.classList.remove('active-playing');
        headerSoundIndicator.title = 'Sound Effects';
      }
    }
  }

  // Gentle SOS Reassurance Chime
  playSosBeacon() {
    if (!SMARAN_STATE.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  }

  // Emergency Assistance Beacon / Alert
  playEmergencyAlarm() {
    if (!SMARAN_STATE.soundEnabled) return;
    this.stopEmergencyAlarm();
    this.initContext();
    if (!this.ctx) return;

    try {
      let step = 0;
      this.emergencyAlarmTimer = setInterval(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(step % 2 === 0 ? 880 : 660, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
        step++;
      }, 350);
    } catch (e) {}
  }

  stopEmergencyAlarm() {
    if (this.emergencyAlarmTimer) {
      clearInterval(this.emergencyAlarmTimer);
      this.emergencyAlarmTimer = null;
    }
  }
}

window.smaranAudio = new SmaranAudioEngine();

