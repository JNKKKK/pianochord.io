import { Chord } from "./chord"
import { allChords, chords } from "./db"


function getHighlightTable(chord: Chord) {
    let highlightTable: boolean[] = Array(12 * 3).fill(false)
    let startIndex = chord.key
    highlightTable[startIndex] = true
    chord.intervals.reduce((previousValue, currentValue) => {
        let accumulate = previousValue + currentValue
        highlightTable[accumulate] = true
        return accumulate
    }, startIndex)
    return highlightTable
}

function chordAlignMid(highlightTable: boolean[]): boolean[] {
    // if all the notes are in first 2/3 of the keyboard (3 octaves)
    if (highlightTable.slice(24).every(h => h === false)) {
        // move notes to the middle octave
        return Array(12).fill(false).concat(highlightTable.slice(0, 24))
    } else {
        // otherwise, do not move notes. Notes will use octave 4 as base
        return highlightTable
    }
}

function findChordByName(key: string, chordName: string) {
    return chords[key].find(c => {
        if (c.name === chordName) return true
        return false
    })
}

// C-flat.. -> Cb
function urlDecodeKey(key: string | undefined): string | undefined {
    if (key) {
        return key.replace('-flat', 'b').replace('-sharp', '#')
    } else {
        return undefined
    }
}
// C# -> C-sharp
function urlEncodeKey(key: string): string {
    return key.replace('#', '-sharp').replace('b', '-flat')
}
// #->sharp  /->_  ' '->-
function urlEncodeChord(chordName: string): string {
    return chordName.replace(/#/g, 'sharp').replace(/\//g, '_').replace(/ /g, '-')
}
function urlDecodeChord(chordName: string | undefined): string | undefined {
    if (chordName) {
        return chordName.replace(/sharp/g, '#').replace(/_/g, '/').replace(/-/g, ' ')
    } else {
        return undefined
    }
}

function chordFilterByKeyword(kw: string) {
    return (chord: Chord) => {
        kw = kw.toLowerCase().replace(' ', '')
        let allNames = chord.possibleNames.map((str: string) => str.toLowerCase().replace(' ', ''))
        return allNames.some(name => name.indexOf(kw) !== -1)
    }
}

function searchForChord(kw: string): Chord[] {
    type ChordScore = {
        chord: Chord,
        score: number,
    };
    kw = kw.toLowerCase().replace(' ', '');
    if (!kw) return []
    let chordsWithScores: ChordScore[] = allChords.map(chord => {
        let score = 0
        let allNames = chord.possibleNames.map((str: string) => str.toLowerCase().replace(' ', ''))
        allNames.forEach(name => {
            if (name === kw) {
                score += 1
            } else if (name.indexOf(kw) !== -1) {
                score += 0.1
            }
        })
        score /= allNames.length
        return { chord, score }
    })
    let result = chordsWithScores.sort((a, b) => (b.score - a.score)).filter(cs => cs.score > 0).map(cs => cs.chord).slice(0, 20)
    return result
}

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t));

function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0)
}

export {
    getHighlightTable, chordAlignMid, findChordByName, sum, searchForChord,
    urlDecodeKey, urlEncodeKey, urlEncodeChord, urlDecodeChord, delay, chordFilterByKeyword
}