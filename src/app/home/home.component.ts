import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Tone from 'tone'

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(click)': 'onClickContainer($event)',
  }
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

  private synth: Tone.DuoSynth
  // private synth: Tone.PolySynth<Tone.DuoSynth>
  private delay: Tone.FeedbackDelay

  constructor() {

    // this.synth = new Tone.PolySynth(Tone.DuoSynth)

    this.synth = new Tone.DuoSynth()

    this.synth.set({
      voice1: {
        envelope: {
          attack: .1,
          release: 5,
          decay: 1,
          sustain: 1
        }
      },
      voice0: {
        envelope: {
          attack: .1,
          release: 5,
          decay: 1,
          sustain: 1,
        }
      },
      harmonicity: 0.1,
      vibratoRate: 1,
      vibratoAmount: .1,
    })

    

    this.synth.volume.value = -20

    this.delay = new Tone.FeedbackDelay(.3, .7)

    this.synth.connect(this.delay)

    this.delay.toDestination()
    this.synth.toDestination()
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    setInterval(() => {

      // this.synth.set({ harmonicity: Math.random() * 1 + .5})

    }, 100)
  }

  ngOnDestroy() {

    this.synth.dispose()
  }


  private init: boolean = false
  onClickContainer(e: MouseEvent) {

    if(this.init == false) {

      this.init = true
      Tone.start()
      Tone.Transport.start()
    }
  }


  onClick(e: MouseEvent) {

    if(this.init == true) {

      const notes = ['F', 'C', 'E', 'G']
      const i = Math.round(Math.random() * (notes.length-1))
      const o = Math.round(Math.random() * 5) + 1
      const note = notes[i] + o

      this.synth.triggerAttackRelease(note, .5, Tone.context.currentTime)
      // this.synth.triggerAttackRelease('C4', .1, Tone.context.currentTime)
      // this.synth.triggerAttackRelease('E4', .1, Tone.context.currentTime)
    }
  }
}
