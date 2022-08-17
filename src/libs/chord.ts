import { Note } from './note'
import { chordTable } from './db'
import { Key, keyMax } from './key'

class Chord {
    key: Key
    intervals: number[]
    names: string[]

    constructor(key: Key, intervals: number[]) {
        this.key = key
        this.intervals = intervals
        this.names = []
    }
}



export { Chord }