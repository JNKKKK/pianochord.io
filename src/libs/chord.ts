import { Key } from './key'

class Chord {
    key: Key
    intervals: number[]
    names: string[]
    quality: string
    tonic?: string

    constructor(key: Key, intervals: number[]) {
        this.key = key
        this.intervals = intervals
        this.names = []
        this.quality = 'Unknown'
    }

    get name(): string {
        return this.names[0]
    }
}



export { Chord }