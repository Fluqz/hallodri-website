import * as Tone from 'tone'

export class Synthesizer {

    synth: Tone.PolySynth<Tone.DuoSynth>
    delay: Tone.FeedbackDelay

    private activeNotes: string[]

    muted: boolean = false

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

        this.synth.volume.value = -20

        this.delay = new Tone.FeedbackDelay(0.3, 0.7)

        this.synth.connect(this.delay)

        this.delay.toDestination()
        this.synth.toDestination()
    }

    mute(m:boolean) {

        if(this.muted == m) return
        
        this.muted = m === true ? true : false

        if(this.muted) Tone.Destination.volume.exponentialRampTo(Number.NEGATIVE_INFINITY, .3, Tone.now())
        else Tone.Destination.volume.exponentialRampTo(1, .3, Tone.now())
    }

    triggerAttack(note: Tone.Unit.Note) {

        let i = this.activeNotes.push(note) - 1
        this.synth.triggerAttack(this.activeNotes[i], Tone.context.currentTime)
    }

    triggerRelease() {

        this.synth.releaseAll()
    }

    releaseAll() {

        this.synth.releaseAll()

        this.activeNotes.length = 0
    }

    destroy() {

        this.synth.releaseAll()
        this.synth.dispose()
    }
}
