import { bwMap, chromaticName, KeyName, Keys, Octave, OctaveKeyCount } from './key'
import piano from '../libs/audio'

class Note {
    key: KeyName
    octave: Octave

    constructor(key: KeyName, octave: Octave) {
        this.key = key
        this.octave = octave
    }

    play() {
        return piano.play(Keys[this.key], this.octave)
    }

    toString() {
        return chromaticName[Keys[this.key]] + this.octave
    }

    valueOf() {
        return this.octave * OctaveKeyCount + this.key
    }

    get bw() {
        return bwMap[Keys[this.key]]
    }
}


export { Note }