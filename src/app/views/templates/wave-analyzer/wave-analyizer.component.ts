import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import * as Tone from 'tone';

@Component({
  selector: 'wave-analyzer',
  templateUrl: './wave-analyizer.component.html',
  styleUrls: ['./wave-analyizer.component.scss'],
})
export class WaveAnalyzerComponent implements AfterViewInit, OnDestroy {

  @Input() node!: Tone.ToneAudioNode

  @Output() onSilence = new EventEmitter()

  w: number = 0;
  h: number = 0;
  amplitude: number = 0;
  frequency: number = 0;
  phase: number = 0;
  noise: number = 5;

  waves: string[] = [];
  colors: string[] = [];

  private _AFID!: number;
  private analyser!: Tone.Analyser;
  private isRunning = false;
  wasSilent = false
  private silenceTimer: any = null;
  private SILENCE_DURATION = 2000; // 2 seconds

  constructor(public ref: ElementRef) {
    this.amplitude = this.h;
    this.frequency = 15.98;
    this.phase = 0;
  }

  ngAfterViewInit() {
    const host: HTMLElement = this.ref.nativeElement;
    this.w = host.clientWidth;
    this.h = host.clientHeight;
    this.amplitude = (this.h / 2) - (this.noise * 2);

    this.init();
  }

  ngOnDestroy() {
    this.stopLoop();
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
  }

  init() {
    // Initialize analyzer wave
    this.waves.push('');

    this.colors = ['#FFFFFF'];

    // Setup Tone.js analyser
    this.analyser = new Tone.Analyser('waveform', 256);
    
    // Connect your Tone.js nodes to the analyser
    // Example: synth.connect(this.analyser);

    // Connect synth to analyser
    this.node.connect(this.analyser);

    this.startLoop();
  }

  public startLoop = () => {
    this.isRunning = true;
    this.loop();
  };

  public loop = () => {
    if (!this.isRunning) return;

    this.update();
    this._AFID = window.requestAnimationFrame(this.loop);
  };

  public stopLoop = () => {
    this.isRunning = false;
    window.cancelAnimationFrame(this._AFID);
  };

  public update = () => {
    this.draw();
  };

  public draw = () => {
    // Get waveform data from Tone.js analyser
    const waveformData = this.analyser.getValue() as Float32Array;
    this.waves[0] = this.createWaveStringFromAnalyser(waveformData);

    // Check if audio is silent
    const isSilent = this.isAudioSilent();
    
    if (isSilent) {
      // Start silence timer if not already started
      if (!this.silenceTimer && !this.wasSilent) {
        this.silenceTimer = setTimeout(() => {
          this.wasSilent = true;
          this.onSilence.emit();
          this.silenceTimer = null;
        }, this.SILENCE_DURATION);
      }
    } else {
      // Cancel silence timer if audio comes back
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
      this.wasSilent = false;
    }
  };

  /**
   * Create wave string from Tone.js analyser waveform data
   */
  public createWaveStringFromAnalyser = (waveformData: Float32Array): string => {
    if (!waveformData || waveformData.length === 0) return '';

    let sliceWidth = this.w / waveformData.length
    let x = 0;
    let wave = '';

    for (let i = 0; i < waveformData.length; i++) {
      // Normalize waveform data to amplitude range
      let y = (waveformData[i] * this.amplitude) + this.amplitude;

      wave += `${x}, ${y} `;
      x += sliceWidth;
    }

    return wave;
  };
     /**
   * Check if audio is silent based on RMS (root mean square)
   */
  public isAudioSilent = (threshold: number = 0.01): boolean => {
    const waveformData = this.analyser.getValue() as Float32Array;

    let sum = 0;
    for (let i = 0; i < waveformData.length; i++) {
      sum += waveformData[i] * waveformData[i];
    }
    const rms = Math.sqrt(sum / waveformData.length);

    return rms < threshold;
  };

  /**
   * f(x) = A sin(wt + p)
   * A is the amplitude, w is the frequency, p is the phase.
   */
  public createWaveString = (
    amplitude: number,
    frequency: number,
    phase: number,
    noise: number = 0
  ): string => {
    let sliceWidth = this.w / 100;
    let x = 0;
    let wave = '';

    for (let i = 0; i < this.w; i++) {
      let y = amplitude * Math.sin((i / frequency) + phase) + amplitude + 1;

      if (noise === 0) {
        wave += `${x}, ${y} `;
      } else {
        wave += `${((Math.random() * noise) - (noise / 2)) + x}, ${((Math.random() * noise) - (noise / 2)) + y} `;
      }

      x += sliceWidth;
    }

    return wave;
  };

}