import { Key } from './key'

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

class Chord {
    key: Key
    intervals: number[]
    alias: string[]
    fullName: string
    quality: string
    tonic: string
    inversions: Chord[]

    constructor(key: Key, intervals: number[]) {
        this.key = key
        this.intervals = intervals
        this.alias = []
        this.fullName = ''
        this.quality = ''
        this.inversions = []
        this.tonic = ''
    }

    get name(): string {
        if (this.fullName) return this.fullName
        return this.alias[0]
    }

    get possibleNames(): string[] {
        if (this.fullName) return [this.fullName, ...this.alias]
        return this.alias
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
                let interval = [...intervalAboveRoot, ...intervalBelowRoot]
                // re-position if it has negative interval
                if (interval.some(x => x < 0)) {
                    // convert from accumulative to absolute interval
                    for (let i = 1; i < interval.length; i++) {
                        interval[i] += interval[i - 1]
                    }
                    // if still has negative
                    if (interval.some(x => x < 0)) {
                        interval = interval.map(x => {
                            if (x >= 0) return x
                            return x + 12
                        })
                    }
                    // re-position
                    interval.sort((a, b) => a - b)
                    // convert back to accumulative interval
                    for (let i = interval.length - 1; i > 0; i--) {
                        interval[i] -= interval[i - 1]
                    }
                }
                this.inversions.push(new Chord(key, interval))
            }
        }
    }

    serialize() {
        return JSON.stringify({ key: this.key, intervals: this.intervals })
    }

    static deserialize(str: string) {
        let data = JSON.parse(str)
        return new Chord(data.key, data.interval)
    }

    toString() {
        return this.serialize()
    }
}



export { Chord }