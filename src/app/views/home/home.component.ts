import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Tone from 'tone'

import { INotification, NOTIFICATIONS, NotificationService } from '../../provider/notification.service';
import { G } from 'src/app/globals';
import { Synthesizer } from 'src/app/synthesizer';
import { AEOLIAN_SCALE, BLUES_9NOTE_SCALE, CHROMATIC, DORIAN_SCALE, HEPTATONIC_SCALE, HEXATONIC_SCALE, HIRAJOSHI_SCALE, IONIAN_SCALE, LOKRIAN_SCALE, LYDIAN_SCALE, MINOR_PENTATONIC_SCALE, MYXOLYDIAN_SCALE, PENTATONIC_SCALE, PHRYGIAN_SCALE, getScale, standard_notes } from 'src/app/util/note-frequencies';
import { Vec2 } from 'src/app/util/vec2';

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

  /** Is the pointer active. Mouse click, touch down or pen down. */
  public pointerDown: boolean = false
  /** Show static wave component */
  public showStaticWave: boolean = true
  /** Show analyzer wave component */
  public showAnalyzerWave: boolean = false
  /** Timeout ID for delay */
  private _delayTimeout: any
  /** Current position of the pointer. */
  private pointerPos: Vec2 = new Vec2()
  /** Position of the pointer down. */
  private pointerDownPos: Vec2 = new Vec2()
  /** Did the pointer leave the window */
  private pointerLeft: boolean = false

  /** Muted flag. */
  private _muted: boolean = false
  /** Notification of the mute event */
  private muteNote: INotification | undefined
  /** Master muted flag */
  masterMuted: boolean = false


  /** Synthesizer class instance using Tone */
  public synthesizer: Synthesizer
  /** Active key note used to determine the scale. */
  public key: Tone.Unit.Note
  /** Scale used to find random notes. */
  public scale: number[]
  /** Number of notes played at a time. */
  public voiceAmount: number

  /** Index number to store the currently used scale. Index is used with the scales array. */
  public scalesIndex: number = 0
  public scales: { name:string, scale:number[] }[] = [

    // [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ]

    // ['A', 'C', 'E', 'F', 'G' ]
    // [ 3, 4, 1, 2 ]
    { name: 'CUSTOM 1', scale: [ 3, 4, 1, 2 ] },

    { name: 'IONIAN', scale: IONIAN_SCALE },
    { name: 'AEOLIAN', scale: AEOLIAN_SCALE },
    { name: 'DORIAN', scale: DORIAN_SCALE },
    { name: 'LYDIAN', scale: LYDIAN_SCALE },
    { name: 'LOKRIAN', scale: LOKRIAN_SCALE },
    { name: 'PHRYGIAN', scale: PHRYGIAN_SCALE },
    { name: 'MYXOLYDIAN', scale: MYXOLYDIAN_SCALE },

    { name: 'MINOR PENTATONIC', scale: MINOR_PENTATONIC_SCALE },
    { name: 'PENTATONIC', scale: PENTATONIC_SCALE },

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

  get destination() {

    return Tone.Destination
  }

  ngAfterViewInit() {

    // setTimeout(() => {
      
      this.notification.send(NOTIFICATIONS.SYSTEM.SYNTH_READY as INotification)
      
      // setTimeout(() => {
        
        this.notification.send(NOTIFICATIONS.SYSTEM.WAVE_ENABLED as INotification)
        
    //   }, 200);
      
    // }, 200);

  }
  ngOnDestroy() {

    // if (this._delayTimeout) clearTimeout(this._delayTimeout)
    this.synthesizer.destroy()
  }

  /** Mute/Unmute everything internally */
  mute(m:boolean) {

    if(this.synthesizer.muted == m) return

    // If master is muted, dont allow changes.
    if(this.masterMuted == true) return

    this.synthesizer.mute(m)

    this._muted = this.synthesizer.muted

    if(this.muteNote != undefined) {

      this.notification.remove(this.muteNote)
    }

    this.muteNote = this.notification.send((this._muted ?  NOTIFICATIONS.AUDIO.MUTED : NOTIFICATIONS.AUDIO.UNMUTED) as INotification)
  }

  /** Mute/Unmute master by user */
  onMuteMaster(e: PointerEvent) {

    e.stopPropagation()

    this.toggleMuteMaster()
  }

  /** Toggles master mute/unmute */
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

  onSilence() {

    console.log('Silent')
    this.showAnalyzerWave = false
    this.showStaticWave = true
  }

  /** On clicking the key note btn. Set to next or previous note of all notes. */
  onChangeKey(e: PointerEvent) {

    e.stopPropagation()

    const key = this.key.replace(/[0-9]/g, '')

    let i = standard_notes.indexOf(key)

    if(i == -1) return

    if(e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) i--
    else i++

    if(i >= standard_notes.length) i = 0
    else if(i < 0) i = standard_notes.length - 1

    this.key = (standard_notes[i] + '3') as Tone.Unit.Note
  }

  /** On clicking the scale btn. Set to next or previous scale in scales array. */
  onChangeScale(e: PointerEvent) {

    e.stopPropagation()

    let i = this.scalesIndex

    if(e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) i--
    else i++

    if(i >= this.scales.length) i = 0
    else if(i < 0) i = this.scales.length - 1

    this.scalesIndex = i

    this.scale = this.scales[this.scalesIndex].scale

    if(this.voiceAmount > this.scale.length) this.voiceAmount = this.scale.length
  }

  /** On clicking voice amount btn. Increasing or decreasing the voice amount by 1. */
  onVoiceAmountKey(e: PointerEvent) {

    e.stopPropagation()

    if(e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) this.voiceAmount--
    else this.voiceAmount++

    if(this.voiceAmount > this.scale.length) this.voiceAmount = 1
    else if(this.voiceAmount <= 0) this.voiceAmount = this.scale.length
  }

  /** Toggles delay */
  onToggleDelay(e: PointerEvent) {

    this.synthesizer.toggleDelay()
  }

  /** Pointer down event. Initializes ToneJs or triggers synthesizer.
   * Unfortunately it is impossible to distinguish between pointerdown and mobile scrolling.
   * Every mobile scrolling will fire pointerdown -> pointermove.
   * 
   * TODO - How to prevent triggering the synth when intending to scroll on mobile??
   * 
   */
  onPointerDown(e: PointerEvent) {

    // Prevent Right click (Cant say 100% that button == 2 = rightClick?!)
    if(e.button == 2) {
      this.synthesizer.releaseAll()
      return 
    }

    // Cancel any pending timeout from previous interaction
    // if (this._delayTimeout) clearTimeout(this._delayTimeout)

    this.pointerDown = true

    this.pointerDownPos.set(e.clientX, e.clientY)
    this.pointerPos.copy(this.pointerDownPos)

    /** Initialize ToneJs */
    if(G.init == false) {

      G.init = true
      Tone.start()
      Tone.Transport.start()

      this.notification.send(NOTIFICATIONS.AUDIO.SOUND_ON as INotification)
    }
    // Play synthesizer
    else {

      // Switch to analyzer wave on pointer down
      this.showStaticWave = false
      this.showAnalyzerWave = true

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

  /** Triggers the synthesizer to play notes.
   * The key note and scale is used to get an array of possible notes.
   * The amount of notes is determined by the voiceAmount. 
   * Random notes from the notes array are used to trigger the synthesizer.
   */
  private triggerSynth() : Tone.Unit.Note[] {

    const getRandomNoteFromNotes = (notes: Tone.Unit.Note[]) => {

      const i = Math.round(Math.random() * (notes.length-1))
      const o = Math.round(Math.random() * 5) + 1

      const note = (notes[i].replace(/[0-9]/g, '') + o)

      return note as Tone.Unit.Note
    }


    const scaleNotes = getScale(this.key, this.scale)

    if(scaleNotes == null) {
     
      throw console.error('Error getScale(args...) returns null! - Home.component.ts - triggerSynth()');
      return []
    }


    const notes: Tone.Unit.Note[] = []

    for(let i = 0; i < this.voiceAmount; i++) {

      const note = getRandomNoteFromNotes(scaleNotes)
      notes.push(note)
      
      this.synthesizer.triggerAttack(note)
    }

    return notes
  }

  /** Pointer up event. Releases all triggered notes. */
  onPointerUp(e: PointerEvent) {

    this.pointerDown = false

    this.synthesizer.releaseAll()

    // Clear existing timeout if any
    // if (this._delayTimeout) clearTimeout(this._delayTimeout)

    // // Switch back to static wave after 1 second delay
    // this._delayTimeout = setTimeout(() => {
    //   this.showAnalyzerWave = false
    //   this.showStaticWave = true
    // }, 1000)
  }

  /** Pointer move event. Prevents unwanted triggering of the synth, 
   * by checking the pointer position. Basicly checks for a drag and releases all
   * triggered notes.
   *
   * */
  onPointerMove(e: PointerEvent) {

    this.pointerPos.set(e.clientX, e.clientY)

    if(this.pointerDownPos.distanceTo(this.pointerPos) > 10) {

      this.synthesizer.releaseAll()
    }

    if(this.pointerLeft == true) {

      this.pointerLeft = false
      this.mute(false)
    }
  }
  
  /** Not working */
  onMouseLeave(e: MouseEvent) {

    console.log('out', e.clientX, e.clientY)

    this.pointerLeft = true

    this.synthesizer.releaseAll()

    this.mute(true)
  }

  /** Focusing browser window. */
  onFocus(e: Event) {

    this.synthesizer.releaseAll()

    this.mute(false)
  }

  /** Leaving browser window. */
  onBlur(e: Event) {

    this.synthesizer.releaseAll()

    this.mute(true)
  }

  /** Visibility of open website. Changing tabs or desktops. Similar to focus/blur events */
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
