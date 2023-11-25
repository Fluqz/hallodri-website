
import * as Tone from 'tone'

/** Returns a Note by name = [Note + Octave] = C3, C#0, .. */
export const getNote = (note: string) : Tone.Unit.Note | null => { 

    for(let n of notes) {

        if(n === note) return n
    }

    return null
}

/** Returns the 8 notes of a scale. Pass in the prime note. */
export const getScale = (prime: Tone.Unit.Note, scale: number[]) : Tone.Unit.Note[] | null => {

    const i = notes.indexOf(prime)

    if(i == -1) return null

    const ns: Tone.Unit.Note[] = []

    ns.push(prime)

    let incr: number = 0
    for (let p = 0; p < scale.length; p++) {

        incr += scale[p]

        if(notes[i + incr] == undefined)
            throw console.error('OUT OF NOTES - REACHED THE END OF THE ARRAY OF NOTES! app/util/note-frequencies.ts');
        
        ns.push(notes[i + incr])
    }

    // console.log('SCALE', ns)

    return ns
}



/** Prime, Sekunde, Terz, Quarte, Quinte, Sexte, Septime, Oktave, */
/** Major Scale */
export const IONIAN_SCALE: number[] = [ 2, 2, 1, 2, 2, 2, 1 ]
export const DORIAN_SCALE: number[] = [ 2, 1, 2, 2, 2, 1, 2 ]
export const PHRYGIAN_SCALE: number[] = [ 1, 2, 2, 2, 1, 2, 2 ]
export const LYDIAN_SCALE: number[] = [ 2, 2, 2, 1, 2, 2, 1 ]
export const MYXOLYDIAN_SCALE: number[] = [ 2, 2, 1, 2, 2, 1, 2 ]
export const AEOLIAN_SCALE: number[] = [ 2, 1, 2, 2, 1, 2, 2 ]
export const LOKRIAN_SCALE: number[] = [ 1, 2, 2, 1, 2, 2, 2 ]

export const PENTATONIC_SCALE: number[] = [ 2, 3, 3, 2, 3 ]

export const HIRAJOSHI_SCALE: number[] = [ 2, 1, 4, 1, 4 ]

/** 5 Note blues scale */
export const MINOR_PENTATONIC_SCALE: number[] = [ 3, 2, 2, 3, 2 ]
/** 6 Note blues scale */
export const HEXATONIC_SCALE: number[] = [ 3, 2, 1, 1, 3, 2 ]
/** 7 Note blues scale */
export const HEPTATONIC_SCALE: number[] = [ 2, 1, 2, 1, 3, 1, 2 ]
/** 9 Note blues scale */
export const BLUES_9NOTE_SCALE: number[] = [ 2, 1, 1, 1, 2, 2, 1, 1, 1 ]

export const CHROMATIC: number[] = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]



export const standard_notes: string[] = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ]

/** List of all notes. https://pages.mtu.edu/~suits/notefreqs.html */
export const notes: Tone.Unit.Note[] = [

    'C0',
    'C#0',
    'D0',
    'D#0', 
    'E0', 
    'F0', 
    'F#0',	
    'G0', 
    'G#0', 
    'A0', 
    'A#0', 
    'B0', 
    'C1', 
    'C#1', 
    'D1', 
    'D#1', 
    'E1', 
    'F1', 
    'F#1', 
    'G1', 
    'G#1', 
    'A1', 
    'A#1', 
    'B1',
    'C2', 
    'C#2',	
    'D2', 
    'D#2',	
    'E2', 
    'F2', 
    'F#2',	
    'G2', 
    'G#2', 
    'A2', 
    'A#2', 
    'B2', 
    'C3', 
    'C#3', 
    'D3', 
    'D#3', 
    'E3', 
    'F3', 
    'F#3', 
    'G3', 
    'G#3', 
    'A3',
    'A#3', 
    'B3', 
    'C4', 
    'C#4', 
    'D4', 
    'D#4', 
    'E4', 
    'F4', 
    'F#4', 
    'G4', 
    'G#4', 
    'A4', 
    'A#4', 
    'B4', 
    'C5', 
    'C#5', 
    'D5', 
    'D#5', 
    'E5', 
    'F5', 
    'F#5', 
    'G5', 
    'G#5', 
    'A5', 
    'A#5', 
    'B5', 
    'C6', 
    'C#6', 
    'D6', 
    'D#6', 
    'E6', 
    'F6', 
    'F#6', 
    'G6', 
    'G#6', 
    'A6', 
    'A#6', 
    'B6', 
    'C7', 
    'C#7', 
    'D7', 
    'D#7', 
    'E7', 
    'F7', 
    'F#7', 
    'G7', 
    'G#7', 
    'A7', 
    'A#7', 
    'B7', 
    'C8', 
    'C#8', 
    'D8', 
    'D#8', 
    'E8', 
    'F8', 
    'F#8', 
    'G8', 
    'G#8', 
    'A8', 
    'A#8', 
    'B8', 
]