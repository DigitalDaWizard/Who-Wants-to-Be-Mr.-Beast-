type SoundKey = 
  | 'intro' 
  | 'correct' 
  | 'wrong' 
  | 'lifeline' 
  | 'tension' 
  | 'victory' 
  | 'click' 
  | 'tick' 
  | 'checkpoint' 
  | 'bg'
  | 'phone'
  | 'cut'
  | 'audience';

// Helper to store either buffer nodes or oscillator nodes
type AudioSource = AudioBufferSourceNode | OscillatorNode;

class AudioService {
  private context: AudioContext | null = null;
  private buffers: Map<SoundKey, AudioBuffer> = new Map();
  private sources: Map<SoundKey, AudioSource> = new Map(); // Track active sources to stop them
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private loops: Set<SoundKey> = new Set(['tension', 'bg']);

  private soundFiles: Record<SoundKey, string> = {
    intro: '/assets/sounds/intro.mp3',
    correct: '/assets/sounds/correct.mp3',
    wrong: '/assets/sounds/wrong.mp3',
    lifeline: '/assets/sounds/lifeline.mp3',
    tension: '/assets/sounds/tension.mp3',
    victory: '/assets/sounds/victory.mp3',
    click: '/assets/sounds/button-click.mp3',
    tick: '/assets/sounds/timer-tick.mp3',
    checkpoint: '/assets/sounds/checkpoint.mp3',
    bg: '/assets/sounds/ambient-bg.mp3',
    phone: '/assets/sounds/phone.mp3',
    cut: '/assets/sounds/cut.mp3',
    audience: '/assets/sounds/audience.mp3'
  };

  constructor() {
    // Context is created lazily
  }

  private initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public async preload() {
    this.initContext();
    if (!this.context) return;

    const promises = Object.entries(this.soundFiles).map(async ([key, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context!.decodeAudioData(arrayBuffer);
        this.buffers.set(key as SoundKey, audioBuffer);
      } catch (e) {
        // console.warn(`Audio asset missing: ${key}. Will use synth fallback.`);
      }
    });

    await Promise.all(promises);
  }

  public play(key: SoundKey, loop = false) {
    this.initContext();
    if (!this.context || !this.gainNode) return;

    // Stop existing sound of same type
    this.stop(key);

    const buffer = this.buffers.get(key);
    
    if (buffer) {
      // Play File
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = loop || this.loops.has(key);
      source.connect(this.gainNode);
      source.start();
      this.sources.set(key, source);
      
      source.onended = () => {
        if (!source.loop) this.sources.delete(key);
      };
    } else {
      // Synth Fallback
      this.playSynthFallback(key, loop);
    }
  }

  public stop(key: SoundKey) {
    const source = this.sources.get(key);
    if (source) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      this.sources.delete(key);
    }
  }

  public stopAll() {
    this.sources.forEach((source) => {
        try { source.stop(); } catch(e) {}
    });
    this.sources.clear();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(muted ? 0 : 1, this.context?.currentTime || 0);
    }
  }

  // --- SYNTHESIZER FALLBACKS ---
  // Generates sounds mathematically if MP3s are missing
  private playSynthFallback(key: SoundKey, loop: boolean) {
    if (this.isMuted || !this.context || !this.gainNode) return;
    const now = this.context.currentTime;
    
    // Create a local gain for envelope shaping
    const soundGain = this.context.createGain();
    soundGain.connect(this.gainNode);

    let mainOsc: OscillatorNode | null = null;

    switch (key) {
      case 'click':
        mainOsc = this.createOsc('sine', 800, now);
        mainOsc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        this.envelope(soundGain, 0.1, 0.01, 0.1, now);
        mainOsc.connect(soundGain);
        mainOsc.start(now);
        mainOsc.stop(now + 0.1);
        break;

      case 'tick':
        mainOsc = this.createOsc('square', 800, now);
        this.envelope(soundGain, 0.05, 0.01, 0.05, now);
        mainOsc.connect(soundGain);
        mainOsc.start(now);
        mainOsc.stop(now + 0.05);
        break;

      case 'correct':
        // High pitched ding
        mainOsc = this.createOsc('triangle', 600, now);
        mainOsc.frequency.setValueAtTime(600, now);
        mainOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        this.envelope(soundGain, 0.1, 0, 0.6, now);
        mainOsc.connect(soundGain);
        mainOsc.start(now);
        mainOsc.stop(now + 0.6);
        break;

      case 'wrong':
        // Low buzzer
        mainOsc = this.createOsc('sawtooth', 150, now);
        mainOsc.frequency.linearRampToValueAtTime(100, now + 0.4);
        this.envelope(soundGain, 0.2, 0, 0.4, now);
        mainOsc.connect(soundGain);
        mainOsc.start(now);
        mainOsc.stop(now + 0.4);
        break;

      case 'lifeline':
         mainOsc = this.createOsc('sine', 400, now);
         mainOsc.frequency.linearRampToValueAtTime(800, now + 0.3);
         this.envelope(soundGain, 0.1, 0, 0.3, now);
         mainOsc.connect(soundGain);
         mainOsc.start(now);
         mainOsc.stop(now + 0.3);
         break;

      case 'phone':
         // Ring ring (two tones)
         const osc1 = this.createOsc('sine', 440, now);
         const osc2 = this.createOsc('sine', 480, now);
         
         // Tremolo
         const lfo = this.createOsc('sine', 20, now);
         const lfoGain = this.context.createGain();
         lfoGain.gain.value = 0.5;
         lfo.connect(lfoGain.gain);
         
         osc1.connect(lfoGain);
         osc2.connect(lfoGain);
         lfoGain.connect(soundGain);

         this.envelope(soundGain, 0.2, 0.1, 1.5, now);
         
         osc1.start(now); osc1.stop(now + 1.5);
         osc2.start(now); osc2.stop(now + 1.5);
         lfo.start(now); lfo.stop(now + 1.5);
         break;

      case 'cut':
         // White noise burst
         const bufferSize = this.context.sampleRate * 0.2; // 0.2s
         const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
         const data = buffer.getChannelData(0);
         for (let i = 0; i < bufferSize; i++) {
           data[i] = Math.random() * 2 - 1;
         }
         const noise = this.context.createBufferSource();
         noise.buffer = buffer;
         const noiseFilter = this.context.createBiquadFilter();
         noiseFilter.type = 'highpass';
         noiseFilter.frequency.value = 1000;
         noise.connect(noiseFilter);
         noiseFilter.connect(soundGain);
         this.envelope(soundGain, 0.3, 0.01, 0.2, now);
         noise.start(now);
         break;

      case 'audience':
         // Low rumble / crowd noise sim
         const aOsc = this.createOsc('sawtooth', 50, now);
         const aFilter = this.context.createBiquadFilter();
         aFilter.type = 'lowpass';
         aFilter.frequency.value = 200;
         // Modulate filter
         const aLfo = this.createOsc('sine', 8, now);
         const aLfoGain = this.context.createGain();
         aLfoGain.gain.value = 150;
         aLfo.connect(aLfoGain);
         aLfoGain.connect(aFilter.frequency);
         
         aOsc.connect(aFilter);
         aFilter.connect(soundGain);
         
         this.envelope(soundGain, 0.2, 0.5, 1.0, now);
         aOsc.start(now); aOsc.stop(now + 1.0);
         aLfo.start(now); aLfo.stop(now + 1.0);
         break;

      case 'checkpoint':
         // Two chimes
         const t1 = 0;
         const t2 = 0.15;
         
         const o1 = this.createOsc('sine', 1000, now + t1);
         const g1 = this.context.createGain();
         g1.connect(this.gainNode);
         this.envelope(g1, 0.1, 0, 0.5, now + t1);
         o1.connect(g1);
         o1.start(now + t1);
         o1.stop(now + t1 + 0.5);

         const o2 = this.createOsc('sine', 1500, now + t2);
         const g2 = this.context.createGain();
         g2.connect(this.gainNode);
         this.envelope(g2, 0.1, 0, 0.5, now + t2);
         o2.connect(g2);
         o2.start(now + t2);
         o2.stop(now + t2 + 0.5);
         break;

      case 'intro':
         // Arpeggio C Major
         const notes = [261.63, 329.63, 392.00, 523.25];
         notes.forEach((freq, i) => {
             const t = now + (i * 0.1);
             const osc = this.createOsc('triangle', freq, t);
             const g = this.context!.createGain();
             g.connect(this.gainNode!);
             this.envelope(g, 0.1, 0, 0.3, t);
             osc.connect(g);
             osc.start(t);
             osc.stop(t + 0.3);
         });
         break;

      case 'victory':
         // Fast Arpeggio
         const vNotes = [392.00, 523.25, 659.25, 783.99, 1046.50];
         vNotes.forEach((freq, i) => {
             const t = now + (i * 0.12);
             const osc = this.createOsc('square', freq, t);
             const g = this.context!.createGain();
             g.connect(this.gainNode!);
             this.envelope(g, 0.05, 0, 0.4, t);
             osc.connect(g);
             osc.start(t);
             osc.stop(t + 0.4);
         });
         break;

      case 'tension':
        // Pulsing Drone (Simulated)
        if (loop || this.loops.has(key)) {
            mainOsc = this.createOsc('triangle', 60, now); // Low drone
            const lfo = this.createOsc('sine', 4, now); // 4Hz pulse
            const lfoGain = this.context.createGain();
            lfoGain.gain.value = 50; // Modulate gain/filter
            
            // Just simple volume pulse
            soundGain.gain.setValueAtTime(0.05, now);
            soundGain.gain.setTargetAtTime(0.02, now, 0.25); // simple decay
            // We can't easily loop complex modulation without custom nodes, 
            // so we just play a steady low drone for tension.
            mainOsc.connect(soundGain);
            mainOsc.start(now);
            // We store it to stop it later
            this.sources.set(key, mainOsc);
        }
        break;
        
      case 'bg':
         if (loop || this.loops.has(key)) {
             // Ethereal high drone
             mainOsc = this.createOsc('sine', 880, now);
             soundGain.gain.setValueAtTime(0.01, now);
             mainOsc.connect(soundGain);
             mainOsc.start(now);
             this.sources.set(key, mainOsc);
         }
         break;
    }
  }

  // --- HELPERS ---

  private createOsc(type: OscillatorType, freq: number, time: number): OscillatorNode {
      const osc = this.context!.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      return osc;
  }

  private envelope(gainNode: GainNode, vol: number, attack: number, release: number, time: number) {
      gainNode.gain.cancelScheduledValues(time);
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(vol, time + attack);
      gainNode.gain.linearRampToValueAtTime(0, time + release); // Simple AD envelope
  }
}

export const audioService = new AudioService();