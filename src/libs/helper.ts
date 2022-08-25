import { Chord } from "./chord"
import { chordTable } from "./db"
import { Key, OctaveKeyCount, keySimpleList } from "./key"
import { Note } from "./note"

const bwMap = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']

const chromaticScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const possibleOctaveList = [
    '2,3,4',
    '3,4,5',
    '4,5,6',
    '5,6,7'
]


let notes: Note[] = []

for (let oct = 2; oct <= 6; oct++) {
    for (let k = 0; k < OctaveKeyCount; k++) {
        notes.push(new Note(k, oct))
    }
}

type chordsDB = {
    [key: string]: Chord[]
}
let chords: chordsDB = {}


keySimpleList.forEach((k: string) => {
    chords[k] = []
    chordTable.forEach(row => {
        let chord = new Chord(Key[k], row.intervals)
        chord.tonic = k
        let name = row.name ? `${k} ${row.name}` : null
        let alias = row.aliases.map(str => `${k}${str}`)
        chord.names = name ? [name, ...alias] : [...alias]
        chord.quality = row.quality
        chords[k].push(chord)
    })

})

function getDisplayName(chord: Chord) {
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

function chordAlignMid(highlightTable: boolean[]) {
    if (highlightTable.slice(24).every(h => !h)) {
        return {
            highlightTable: Array(12).fill(false).concat(highlightTable.slice(0, 24)),
            octave: [3, 4, 5]
        }
    } else {
        return {
            highlightTable,
            octave: [4, 5, 6]
        }
    }
}

function url2ChordData(key: string, chordName: string) {
    return chords[key].find(c => {
        if (c.names[0] === chordName || c.names[1] === chordName) return true
        return false
    })
}

// C-flat.. -> Cb
function urlDecodeKey(key: string) {
    return key.replace('-flat', 'b').replace('-sharp', '#')
}
// C# -> C-sharp
function urlEncodeKey(key: string) {
    return key.replace('#', '-sharp').replace('b', '-flat')
}
// #->s /->_ ' '->-
function urlEncodeChord(chordName: string) {
    chordName = chordName.replace(/#/g, 'sharp')
    chordName = chordName.replace(/\//g, '_')
    chordName = chordName.replace(/ /g, '-')
    return chordName
}
function urlDecodeChord(chordName: string) {
    chordName = chordName.replace(/sharp/g, '#')
    chordName = chordName.replace(/_/g, '/')
    chordName = chordName.replace(/-/g, ' ')
    return chordName
}
// 'C4' -> '4'
function keyNameToOctave(name: string) {
    return name[name.length - 1]
}
// 'C4' -> 'C'
// 'F#4' -> 'F#'
// 'Db4' -> 'C#'
function keyNameToSynthNote(name: string) {
    if (name.length === 2) {
        return name[0]
    } else if (name.length === 3) {
        if (name[1] === 'b') {
            var noteLetter = name[0]
            var previousNote = { D: 'C', E: 'D', G: 'F', A: 'G', B: 'A' }
            noteLetter = previousNote[noteLetter]
            return noteLetter + '#'
        } else if (name[1] === '#') {
            return name.slice(0, -1)
        }
    }
}

export {
    notes, chords, getDisplayName, getHighlightTable, bwMap, chordAlignMid, url2ChordData, chromaticScale, possibleOctaveList,
    urlDecodeKey, urlEncodeKey, urlEncodeChord, urlDecodeChord, keyNameToOctave, keyNameToSynthNote
}