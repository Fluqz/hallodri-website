import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Tone from 'tone'
import { INotification, NOTIFICATIONS, NotificationService } from '../../provider/notification.service';
import { G } from 'src/app/globals';
import { Synthesizer } from 'src/app/synthesizer';
import { AEOLIAN_SCALE, BLUES_9NOTE_SCALE, CHROMATIC, DORIAN_SCALE, HEPTATONIC_SCALE, HEXATONIC_SCALE, HIRAJOSHI_SCALE, IONIAN_SCALE, LOKRIAN_SCALE, LYDIAN_SCALE, MINOR_PENTATONIC_SCALE, MYXOLYDIAN_SCALE, PENTATONIC_SCALE, PHRYGIAN_SCALE, getScale, standard_notes } from 'src/app/util/note-frequencies';

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

  private init: boolean = false
  private pointerDown: boolean = false
  /** Did the pointer leave the window */
  private pointerLeft: boolean = false

  private _muted: boolean = false
  masterMuted: boolean = false
  private muteNote: INotification | undefined


  public synthesizer: Synthesizer
  public key: Tone.Unit.Note
  public scale: number[]
  public voiceAmount: number

  public scalesIndex: number = 0
  public scales: { name:string, scale:number[] }[] = [

    // [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ]

    // ['A', 'C', 'E', 'F', 'G' ]
    // [ 3, 4, 1, 2 ]
    { name: 'CUSTOM 1', scale: [ 3, 4, 1, 2 ] },

    { name: 'MINOR PENTATONIC', scale: MINOR_PENTATONIC_SCALE },
    { name: 'PENTATONIC', scale: PENTATONIC_SCALE },

    { name: 'IONIAN', scale: IONIAN_SCALE },
    { name: 'DORIAN', scale: DORIAN_SCALE },
    { name: 'PHRYGIAN', scale: PHRYGIAN_SCALE },
    { name: 'LYDIAN', scale: LYDIAN_SCALE },
    { name: 'MYXOLYDIAN', scale: MYXOLYDIAN_SCALE },
    { name: 'AEOLIAN', scale: AEOLIAN_SCALE },
    { name: 'LOKRIAN', scale: LOKRIAN_SCALE },

    { name: 'HIRAJOSHI', scale: HIRAJOSHI_SCALE },
    { name: 'HEXATONIC', scale: HEXATONIC_SCALE },
    { name: 'HEPTATONIC', scale: HEPTATONIC_SCALE },
    { name: 'BLUES 9NOTE', scale: BLUES_9NOTE_SCALE },

    { name: 'CHROMATIC', scale: CHROMATIC },
  ]

  constructor(public notification: NotificationService) {

    this.synthesizer = new Synthesizer()

    this.scale = this.scales[this.scalesIndex].scale
    this.key = 'A3'
    this.voiceAmount = 2
  }

  ngAfterViewInit() {

    this.notification.send(NOTIFICATIONS.SYSTEM.SYNTH_READY as INotification)

    this.notification.send(NOTIFICATIONS.AUDIO.WAVE_ENABLED as INotification)
  }
  ngOnDestroy() {

    this.synthesizer.destroy()
  }

  mute(m:boolean) {

    if(this.synthesizer.muted == m) return

    if(this.masterMuted == true) return

    this.synthesizer.mute(m)

    this._muted = this.synthesizer.muted

    if(this.muteNote != undefined) {

      this.notification.remove(this.muteNote)
    }

    this.muteNote = this.notification.send(
      (this._muted ?  NOTIFICATIONS.AUDIO.MUTED : NOTIFICATIONS.AUDIO.UNMUTED) as INotification,
    )
  }

  onMuteMaster(e: PointerEvent) {

    e.stopPropagation()

    this.toggleMuteMaster()
  }

  toggleMuteMaster() {

    // MUTE
    if(this.masterMuted == false) {

      this.mute(true)
      this.masterMuted = true


      if(this.muteNote != undefined) {

        this.notification.remove(this.muteNote)
      }
      
      this.muteNote = this.notification.send(NOTIFICATIONS.AUDIO.MUTED as INotification, Number.POSITIVE_INFINITY)
    }
    // UNMUTE
    else {

      this.masterMuted = false
      this.mute(false)
    }
  }

  onChangeKey(e: PointerEvent) {

    e.stopPropagation()

    const key = this.key.replace(/[0-9]/g, '')

    let i = standard_notes.indexOf(key)

    if(i == -1) return

    if(e.shiftKey) i--
    else i++

    if(i >= standard_notes.length) i = 0
    else if(i < 0) i = standard_notes.length - 1

    this.key = (standard_notes[i] + '3') as Tone.Unit.Note
  }

  onChangeScale(e: MouseEvent) {

    e.stopPropagation()

    let i = this.scalesIndex

    if(e.shiftKey) i--
    else i++

    if(i >= this.scales.length) i = 0
    else if(i < 0) i = this.scales.length - 1

    this.scalesIndex = i

    this.scale = this.scales[this.scalesIndex].scale
  }

  onVoiceAmountKey(e: PointerEvent) {

    e.stopPropagation()

    if(e.shiftKey) this.voiceAmount--
    else this.voiceAmount++

    if(this.voiceAmount > this.scale.length) this.voiceAmount = 1
    else if(this.voiceAmount <= 0) this.voiceAmount = this.scale.length

    this.voiceAmount
  }

  onPointerDown(e: PointerEvent) {

    if(e.button == 2) {
      this.synthesizer.releaseAll()
      return 
    }

    this.pointerDown = true

    if(this.init == false) {

      this.init = true
      Tone.start()
      Tone.Transport.start()

      this.notification.send(NOTIFICATIONS.AUDIO.SOUND_ON as INotification)

      this.notification.send({
        type: 'SYSTEM',
        title: 'Synthesizer',
        message: 'CLICK ME !',
        duration: 2000
      })
    }
    else {

      const notes = this.triggerSynth()

      let i = 0
      for(let n of notes) {

        this.notification.send({
          type: 'AUDIO',
          title: 'Note ' + (i + 1),
          message: n,
          duration: 2000
        })

        i++
      }
    }
  }

  private triggerSynth() : Tone.Unit.Note[] {

    const getRandomNoteFromNotes = (notes: Tone.Unit.Note[]) => {

      const i = Math.round(Math.random() * (notes.length-1))
      const o = Math.round(Math.random() * 6) + 1

      const note = (notes[i].replace(/[0-9]/g, '') + o)

      return note as Tone.Unit.Note
    }


    // Scale length == max

    const scaleNotes = getScale(this.key, this.scale)

    if(scaleNotes == null) {
     
      throw console.error('Error getScale(args...) returns null! - Home.component.ts - triggerSynth()');
      return []
    }

    console.log('Scale Notes', scaleNotes)

    const notes: Tone.Unit.Note[] = []

    for(let i = 0; i < this.voiceAmount; i++) {

      const note = getRandomNoteFromNotes(scaleNotes)
      notes.push(note)
      
      this.synthesizer.triggerAttack(note)
    }

    return notes
  }

  onPointerUp(e: PointerEvent) {

    this.pointerDown = false

    this.synthesizer.releaseAll()
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

    this.synthesizer.releaseAll()

    this.mute(true)
  }

  onFocus(e: Event) {

    this.synthesizer.releaseAll()

    this.mute(false)
  }

  onBlur(e: Event) {

    this.synthesizer.releaseAll()

    this.mute(true)
  }

  onVisibilityChange(e: Event) {

    this.synthesizer.releaseAll()

    if (document.visibilityState == "visible") {
              
      this.mute(false)
    }
    else {

      this.mute(true)
    }
  }
}
