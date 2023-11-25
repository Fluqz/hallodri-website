import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Tone from 'tone'
import { INotification, NOTIFICATIONS, NotificationService } from '../../provider/notification.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(document:mousedown)': 'onMouseDown($event)',
    '(document:mouseup)': 'onMouseUp($event)',
  }
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

  // private synth: Tone.DuoSynth
  synth: Tone.PolySynth<Tone.DuoSynth>
  delay: Tone.FeedbackDelay

  private init: boolean = false
  private mouseDown: boolean = false
  private activeNotes: string[]

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

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    // setInterval(() => {

      //@ts-ignore
      // this.synth.set({ harmonicity: [0, .1, 1, .9][Math.round(Math.random() * 3)]})

    // }, 500)
  }

  ngOnDestroy() {

    this.synth.releaseAll()
    this.synth.dispose()
  }


  getNotifications() {

    return this.notification.notifications
  }


  onMouseDown(e: MouseEvent) {

    this.mouseDown = true

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
    }
  }

  onMouseUp(e: MouseEvent) {

    this.mouseDown = false

    let note = this.activeNotes.splice(this.activeNotes.length - 1, 1)
    this.synth.triggerRelease(note, Tone.context.currentTime)

    note = this.activeNotes.splice(this.activeNotes.length - 1, 1)
    this.synth.triggerRelease(note, Tone.context.currentTime)

    // this.synth.releaseAll()
  }
}
