import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Tone from 'tone'
import { INotification, NOTIFICATIONS, NotificationService } from '../../provider/notification.service';
import { G } from 'src/app/globals';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(document:pointerdown)': 'onPointerDown($event)',
    '(document:pointerup)': 'onPointerUp($event)',
    '(window:blur)': 'onBlur($event)',
    '(window:focus)': 'onFocus($event)',
    '(document:visibilitychange)': 'onVisibilityChange($event)',
    '(window:pointermove)': 'onPointerMove($event)',
    '(document:mouseleave)': 'onMouseLeave($event)',
    
  }
})
export class HomeComponent implements OnDestroy, AfterViewInit {

  // private synth: Tone.DuoSynth
  synth: Tone.PolySynth<Tone.DuoSynth>
  delay: Tone.FeedbackDelay

  private init: boolean = false
  private pointerDown: boolean = false
  /** Did the pointer leave the window */
  private pointerLeft: boolean = false
  private activeNotes: string[]

  private _muted: boolean = false

  constructor(public notification: NotificationService) {

    this.activeNotes = []

    //@ts-ignore
    this.synth = new Tone.PolySynth(Tone.DuoSynth)
    // this.synth = new Tone.DuoSynth()

    //@ts-ignore
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
      harmonicity: 1,
      volume: -6
      // vibratoRate: 1,
      // vibratoAmount: .1,
    })

    this.synth.volume.value = -20

    this.delay = new Tone.FeedbackDelay(.3, .7)

    this.synth.connect(this.delay)

    this.delay.toDestination()
    this.synth.toDestination()

  }

  ngAfterViewInit() {

    this.notification.send(NOTIFICATIONS.AUDIO.WAVE_ENABLED as INotification)
  }

  ngOnDestroy() {

    this.synth.releaseAll()
    this.synth.dispose()
  }

  mute(m:boolean) {
    
    this._muted = m === true ? true : false

    if(this._muted) Tone.Destination.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .3, Tone.now())
    else Tone.Destination.volume.exponentialRampTo(1, .3, Tone.now())

    // console.trace()
    this.notification.send((this._muted ?  NOTIFICATIONS.AUDIO.MUTED : NOTIFICATIONS.AUDIO.UNMUTED) as INotification)
  }

  onPointerDown(e: PointerEvent) {

    if(e.button == 2) {
      this.synth.releaseAll()
      return 
    }

    this.pointerDown = true

    if(this.init == false) {

      this.init = true
      Tone.start()
      Tone.Transport.start()

      this.notification.send(NOTIFICATIONS.AUDIO.SOUND_ON as INotification)
    }
    else {

      const getRandomNote = () => {

        const notes = ['F', 'C', 'E', 'G', 'A']
        const i = Math.round(Math.random() * (notes.length-1))
        const o = Math.round(Math.random() * 6) + 1
        const note = notes[i] + o

        return note
      }

      let i = this.activeNotes.push(getRandomNote()) - 1
      this.synth.triggerAttack(this.activeNotes[i], Tone.context.currentTime)

      i = this.activeNotes.push(getRandomNote()) - 1
      this.synth.triggerAttack(this.activeNotes[i], Tone.context.currentTime)

      this.notification.send({
        type: 'AUDIO',
        title: 'Note',
        message: this.activeNotes[this.activeNotes.length - 1],
        duration: 2000
      })

      this.notification.send({
        type: 'AUDIO',
        title: 'Note',
        message: this.activeNotes[this.activeNotes.length - 2],
        duration: 2000
      })
    }
  }

  onPointerUp(e: PointerEvent) {

    this.pointerDown = false

    // if(this.activeNotes.length >= 2) {
    //   let note = this.activeNotes.splice(this.activeNotes.length - 1, 1)
    //   this.synth.triggerRelease(note, Tone.context.currentTime)

    //   note = this.activeNotes.splice(this.activeNotes.length - 1, 1)
    //   this.synth.triggerRelease(note, Tone.context.currentTime)
    // }

    this.synth.releaseAll()

    this.activeNotes.length = 0
  }

  onPointerMove(e: PointerEvent) {

    if(this.pointerLeft == true) {

      this.pointerLeft = false
      this.mute(false)
    }
  }
  
  onMouseLeave(e: MouseEvent) {

    console.log('out', e.clientX, e.clientY)

    this.pointerLeft = true

    this.synth.releaseAll()

    this.mute(true)
  }

  onFocus(e: Event) {

    this.synth.releaseAll()

    this.mute(false)
  }

  onBlur(e: Event) {

    this.synth.releaseAll()

    this.mute(true)
  }

  onVisibilityChange(e: Event) {

    this.synth.releaseAll()

    if (document.visibilityState == "visible") {
              
      this.mute(false)
    }
    else {

      this.mute(true)
    }
  }
}
