import { bwMap, chromaticName, Key, OctaveKeyCount } from './key'
import piano from '../libs/audiosynth'
import { keyNameToSynthNote } from './helper'

class Note {
    key: Key
    octave: number

    constructor(key: Key, octave: number) {
        if (typeof key === 'undefined') throw ('undefined key')
        this.key = key
        this.octave = octave
    }

    play() {
        piano.play(
            keyNameToSynthNote(chromaticName[this.key]),
            this.octave,
            2
        )
    }

    toString() {
        return chromaticName[this.key] + this.octave
    }

    valueOf() {
        return this.octave * OctaveKeyCount + this.key
    }

    get bw() {
        return bwMap[this.key]
    }
}


export { Note }