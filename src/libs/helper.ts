import { Chord } from "./chord"
import { chords } from "./db"

function getDisplayName(chord: Chord) {
    // choose from names[0] or names[1]
    if (chord.names[0].length > 17 && chord.names.length > 1) {
        return chord.names[1]
    } else {
        return chord.names[0]
    }
}

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
        if (c.names[0] === chordName || c.names[1] === chordName) return true
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

// 'C4' -> '4'
function keyNameToOctave(name: string) {
    return name[name.length - 1]
}

// 'C' -> 'C'
// 'F#' -> 'F#'
// 'Db' -> 'C#'
function keyNameToSynthNote(name: string) {
    if (name.length === 1) {
        return name
    } else {
        if (name[1] === 'b') {
            let noteLetter = name[0]
            let previousNote = { D: 'C', E: 'D', G: 'F', A: 'G', B: 'A' }
            noteLetter = previousNote[noteLetter]
            return noteLetter + '#'
        }
        return name
    }
}

export {
    getDisplayName, getHighlightTable, chordAlignMid, findChordByName,
    urlDecodeKey, urlEncodeKey, urlEncodeChord, urlDecodeChord, keyNameToOctave, keyNameToSynthNote
}