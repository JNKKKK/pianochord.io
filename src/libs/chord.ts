import { Key } from './key'

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

class Chord {
    key: Key
    intervals: number[]
    alias: string[]
    fullName: string
    quality: string
    tonic?: string
    inversions: Chord[]

    constructor(key: Key, intervals: number[]) {
        this.key = key
        this.intervals = intervals
        this.alias = []
        this.fullName = ''
        this.quality = 'Unknown'
        this.inversions = []
    }

    get name(): string {
        if (this.fullName) return this.fullName
        return this.alias[0]
    }

    calcInversions() {
        if (this.intervals.length === 3 || this.intervals.length === 4) {
            this.inversions = []
            for (let i = 0; i < this.intervals.length - 1; i++) {
                // (i+1)th inversion
                let key = this.key + sum(this.intervals.slice(0, i + 2))
                key %= 12
                let intervalAboveRoot = this.intervals.slice(i + 1)
                intervalAboveRoot[0] = 0
                let intervalBelowRoot = this.intervals.slice(0, i + 1)
                intervalBelowRoot[0] = 12 - sum(this.intervals)

                this.inversions.push(new Chord(key, [...intervalAboveRoot, ...intervalBelowRoot]))
            }
        }
    }
}



export { Chord }