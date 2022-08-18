import { Key, OctaveKeyCount } from './key'

class Note {
    key: Key
    octave: number

    constructor(key: Key, octave: number) {
        if (typeof key === 'undefined') throw ('undefined key')
        this.key = key
        this.octave = octave
    }

    play() {

    }
    toString() {
        return Key
    }
    valueOf() {
        return this.octave * OctaveKeyCount + this.key
    }
}


export { Note }