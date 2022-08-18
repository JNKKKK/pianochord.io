import { Key } from './key'

class Chord {
    key: Key
    intervals: number[]
    names: string[]
    quality: string

    constructor(key: Key, intervals: number[]) {
        this.key = key
        this.intervals = intervals
        this.names = []
        this.quality = 'Unknown'
    }
}



export { Chord }