import { bwMap, chromaticName, Key, OctaveKeyCount } from './key'
import piano from '../libs/audio'

class Note {
    key: Key
    octave: number

    constructor(key: Key, octave: number) {
        if (typeof key === 'undefined') throw ('undefined key')
        this.key = key
        this.octave = octave
    }

    play() {
        return piano.play(this.key, this.octave)
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