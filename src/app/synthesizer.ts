import * as Tone from 'tone'

export class Synthesizer {

    synth: Tone.PolySynth<Tone.DuoSynth>
    delay: Tone.FeedbackDelay

    private maxVolume: number = -3

    /** Keeping track of all triggered notes. */
    private activeNotes: string[]

    /** Muted flag */
    muted: boolean = false

    public isDelayEnabled: boolean = false

    constructor() {

        this.activeNotes = []

        //@ts-ignore
        this.synth = new Tone.PolySynth(Tone.DuoSynth, /*{ maxPolyphony: 64 }*/)
        // this.synth = new Tone.DuoSynth()

        //@ts-ignore
        this.synth.set({
        voice1: {
            envelope: {
            attack: 0.1,
            release: 1,
            decay: 1,
            sustain: 1,
            },
        },
        voice0: {
            envelope: {
            attack: 0.1,
            release: 1,
            decay: 1,
            sustain: 1,
            },
        },
        harmonicity: 1,
        volume: -6,
        maxPolyphone: 64
        // vibratoRate: 1,
        // vibratoAmount: .1,
        })

        this.synth.volume.value = -10
        Tone.Destination.volume.value = this.maxVolume

        this.delay = new Tone.FeedbackDelay(0.3, 0.7)

        this.synth.connect(this.delay)

        // this.delay.toDestination()
        this.synth.toDestination()
    }

    /** Mute/Unmute the Tone.Destination node. */
    mute(m:boolean) {

        if(this.muted == m) return
        
        this.muted = m === true ? true : false

        if(this.muted) Tone.Destination.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .3, Tone.now())
        else Tone.Destination.volume.exponentialRampTo(this.maxVolume, .3, Tone.now())
    }

    /** Trigger a note. */
    triggerAttack(note: Tone.Unit.Note) {

        let i = this.activeNotes.push(note) - 1
        this.synth.triggerAttack(this.activeNotes[i], Tone.context.currentTime)
    }

    /** Release */
    triggerRelease(note: Tone.Unit.Note) {

        this.synth.triggerRelease(note, Tone.context.currentTime)

        let i = this.activeNotes.indexOf(note)
        this.activeNotes.splice(i, 1)
    }

    toggleDelay(active?:boolean) {

        if(active == undefined) this.isDelayEnabled = !this.isDelayEnabled
        else {

            if(this.isDelayEnabled == active) return
            this.isDelayEnabled = active
        }

        console.log('togle',this.isDelayEnabled)
        if(this.isDelayEnabled) this.delay.toDestination()
        else this.delay.disconnect()
    }

    /** Release all notes. */
    releaseAll() {

        this.synth.releaseAll()

        this.activeNotes.length = 0
    }

    /** Destroy synthesizer. */
    destroy() {

        this.releaseAll()
        this.synth.dispose()
        this.delay.dispose()
    }
}
