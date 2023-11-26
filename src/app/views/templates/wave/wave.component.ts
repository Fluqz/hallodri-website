import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Vec2 } from 'src/app/util/vec2';

@Component({
  selector: 'wave',
  templateUrl: './wave.component.html',
  styleUrls: ['./wave.component.scss'],
  host: {
  }
})
export class WaveComponent implements AfterViewInit {

  w: number
  h: number
  amplitude: number
  frequency: number
  phase: number

  noise: number

  waves: string[]

  lines: string[]

  colors: string[]



  private _AFID!: number;

  constructor(public ref: ElementRef) {
    
    this.w = 100
    this.h = 100

    this.waves = []
    this.lines = []
    this.colors = []

    this.amplitude = this.h / 2
    this.frequency = 15.98
    this.phase = 0

    this.noise = 5
  }

  ngAfterViewInit() {

    const host:HTMLElement = this.ref.nativeElement

    this.w = host.clientWidth
    this.h = host.clientHeight

    this.amplitude = (this.h / 2) - (this.noise * 2)

    this.init()
  }

  init() {

    this.waves.push('')
    this.waves.push('')
    this.waves.push('')
    this.waves.push('')
    // this.waves.push('')

    this.lines.push('')
    this.lines.push('')
    this.lines.push('')
    this.lines.push('')
    // this.lines.push('')

    this.colors = [
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      // '#0000FF',
      '#00FFFF',
      // '#FFFFFF',
      '#FFFF00',
      // '#FF0000',
      '#FF00FF',
    ]

    // this.loop()

    setInterval(() => {

      // this.frequency = Math.min(Math.max(10, this.frequency + ((Math.random() * this.noise)) - this.noise / 2), this.w)

      let rnd = Math.random()

      // if(rnd > .5) this.frequency = this.w / 4
      // else this.frequency = this.w / 2

    }, 1000)

    setInterval(() => {

      this.update()

    }, 100)
  }

  public update = () => {

    this.draw()
  }

  public draw = () => {

    this.waves.map((w, i, waves) => {

      w = this.createWaveString(this.amplitude, this.frequency, this.phase, i == 0 ? 0 : 5)

      waves[i] = w
    })

    this.lines.map((l, i, lines) => {

      l = this.createLineString(i == 0 ? 0 : 5)

      lines[i] = l
    })
  }

  /**
   * f(x) = A sin(wt + p)
   * 
   * A is the amplitude,
   * w is the frequency,
   * p is the phase.
   * 
   * @param noise 
   * @returns 
   */
  public createWaveString = (amplitude: number, frequency: number, phase: number, noise: number = 0) => {

    let sliceWidth = this.w / 100
    let x = 0

    let wave = ''

    for (let i = 0; i < this.w; i++) {
      
      let y = amplitude * Math.sin((i / frequency) + phase) + amplitude + 1

      if(noise == 0) wave += `${x}, ${y} `
      else wave += `${((Math.random() * noise) - (noise / 2)) + x}, ${((Math.random() * noise) - (noise / 2)) + y} `

      x += sliceWidth
    }

    return wave
  }

  public createLineString = (noise: number = 0) => {

    let sliceWidth = this.w / 100
    let x = 0

    let line = ''

    for (let i = 0; i < this.w; i++) {
      
      let y = this.amplitude

      if(noise == null) line += `${x}, ${y} `
      else line += `${((Math.random() * noise) - (noise / 2)) + x}, ${((Math.random() * noise) - (noise / 2)) + y} `

      x += sliceWidth
    }

    return line
  }


  public loop = () => {

    this.update()

    this._AFID = window.requestAnimationFrame(this.loop)
  }

  public stopLoop = () => {

    window.cancelAnimationFrame(this._AFID)
  }

}