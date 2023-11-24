import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Tone from 'tone'
import { INotification, NOTIFICATIONS, NotificationService } from '../../provider/notification.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(click)': 'onClickContainer($event)',
  }
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

  // private synth: Tone.DuoSynth
  private synth: Tone.PolySynth<Tone.DuoSynth>
  private delay: Tone.FeedbackDelay

  constructor(public notification: NotificationService) {

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

    setInterval(() => {

      // this.synth.set({ harmonicity: Math.random() * 1 + .5})

    }, 100)
  }

  ngOnDestroy() {

    this.synth.dispose()
  }


  getNotifications() {

    return this.notification.notifications
  }

  private init: boolean = false
  onClickContainer(e: MouseEvent) {

    if(this.init == false) {

      this.init = true
      Tone.start()
      Tone.Transport.start()

      this.notification.send(NOTIFICATIONS.AUDIO.SOUND_ON as INotification)
    }
  }


  onClick(e: MouseEvent) {

    if(this.init == true) {

      const getRandomNote = () => {

        const notes = ['F', 'C', 'E', 'G', 'A']
        const i = Math.round(Math.random() * (notes.length-1))
        const o = Math.round(Math.random() * 6) + 1
        const note = notes[i] + o

        return note
      }

      this.synth.triggerAttackRelease(getRandomNote(), .5, Tone.context.currentTime)
      this.synth.triggerAttackRelease(getRandomNote(), .5, Tone.context.currentTime)
    }
  }
}
