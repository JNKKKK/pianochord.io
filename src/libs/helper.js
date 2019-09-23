import { chord } from '../libs/@tonaljs/chord/index.esnext'
import { entries } from '../libs/@tonaljs/chord-dictionary/index.esnext'

function setPossibleNames (chordDataList) {
  chordDataList.forEach(chord => {
    var possibleNames = []
    if (chord.name !== chord.tonic + ' ') {
      possibleNames.push(chord.name)
      possibleNames.push(chord.name.split(' ').join(''))
    }
    chord.aliases.filter(alias => alias).forEach(alias => {
      possibleNames.push(chord.tonic + alias)
      possibleNames.push(chord.tonic + ' ' + alias)
    })
    chord.possibleNames = possibleNames
  })
}

var keySelectorList = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
var ChordSortTable = ['1P 3M 5P', '1P 3M 5P 7M', '1P 3M 5P 7M 9M', '1P 3M 5P 7M 9M 13M', '1P 3M 5P 6M', '1P 3M 5P 6M 9M', '1P 3M 5P 7M 11A', '1P 3M 6m 7M', '1P 3m 5P', '1P 3m 5P 7m', '1P 3m 5P 7M', '1P 3m 5P 6M', '1P 3m 5P 7m 9M', '1P 3m 5P 7m 9M 11P', '1P 3m 5P 7m 9M 13M', '1P 3m 5d', '1P 3m 5d 7d', '1P 3m 5d 7m', '1P 3M 5P 7m', '1P 3M 5P 7m 9M', '1P 3M 5P 7m 9M 13M', '1P 3M 5P 7m 11A', '1P 3M 5P 7m 9m', '1P 3M 5P 7m 9A', '1P 3M 7m 9m', '1P 4P 5P', '1P 2M 5P', '1P 4P 5P 7m', '1P 5P 7m 9M 11P', '1P 4P 5P 7m 9m', '1P 5P', '1P 3M 5A', '1P 3M 5A 7M', '1P 3M 5P 7M 9M 11A', '1P 3M 5P 7m 9A', '1P 2M 4P 5P', '1P 3M 13m', '1P 3M 5A 7M 9M', '1P 3M 5A 7m', '1P 3M 5A 7m 9A', '1P 3M 5A 7m 9M', '1P 3M 5A 7m 9M 11A', '1P 3M 5A 7m 9m', '1P 3M 5A 7m 9m 11A', '1P 3M 5A 9A', '1P 3M 5A 9M', '1P 3M 5P 6M 11A', '1P 3M 5P 6M 7M 9M', '1P 3M 5P 6M 9M 11A', '1P 3M 5P 6m 7m', '1P 3M 5P 7M 9A 11A', '1P 3M 5P 7M 9M 11A 13M', '1P 3M 5P 7M 9m', '1P 3M 5P 7m 11A 13m', '1P 3M 5P 7m 13M', '1P 3M 5P 7m 9A 11A', '1P 3M 5P 7m 9A 11A 13M', '1P 3M 5P 7m 9A 11A 13m', '1P 3M 5P 7m 9A 13M', '1P 3M 5P 7m 9A 13m', '1P 3M 5P 7m 9M 11A', '1P 3M 5P 7m 9M 11A 13M', '1P 3M 5P 7m 9M 11A 13m', '1P 3M 5P 7m 9m 11A', '1P 3M 5P 7m 9m 11A 13M', '1P 3M 5P 7m 9m 11A 13m', '1P 3M 5P 7m 9m 13M', '1P 3M 5P 7m 9m 13m', '1P 3M 5P 7m 9m 9A', '1P 3M 5P 9M', '1P 3M 5P 9m', '1P 3M 5d', '1P 3M 5d 6M 7m 9M', '1P 3M 5d 7M', '1P 3M 5d 7M 9M', '1P 3M 5d 7m', '1P 3M 5d 7m 9M', '1P 3M 7m', '1P 3M 7m 13m', '1P 3M 7m 9M', '1P 3M 7m 9M 13M', '1P 3M 7m 9M 13m', '1P 3m 4P 5P', '1P 3m 5A', '1P 3m 5P 6M 9M', '1P 3m 5P 6m 7M', '1P 3m 5P 6m 7M 9M', '1P 3m 5P 7M 9M', '1P 3m 5P 7m 11P', '1P 3m 5P 9M', '1P 3m 5d 6M 7M', '1P 3m 5d 7M', '1P 3m 5d 7m', '1P 3m 6m 7M', '1P 3m 6m 7m', '1P 3m 6m 7m 9M', '1P 3m 6m 7m 9M 11P', '1P 3m 6m 9m', '1P 3m 7m 12d 2M', '1P 3m 7m 12d 2M 4P', '1P 4P 5A 7M', '1P 4P 5A 7M 9M', '1P 4P 5A 7m', '1P 4P 5P 7M', '1P 4P 5P 7M 9M', '1P 4P 5P 7m 9M', '1P 4P 5P 7m 9M 13M', '1P 4P 5P 7m 9m 13m', '1P 4P 7m 10m', '1P 5P 7m 9m 11P']
var chordData = {}
var chordTypes = entries()

keySelectorList.forEach(key => {
  chordData[key] = chordTypes.map(ct => {
    let displayName
    if (ct.name) {
      displayName = ct.name
    } else {
      displayName = ct.aliases[0]
    }
    return chord(key + ' ' + displayName)
  })
  // remove the extra half-diminished
  chordData[key].splice(17, 1)
  setPossibleNames(chordData[key])
  chordData[key].sort((a, b) => ChordSortTable.indexOf(a.intervals.join(' ')) - ChordSortTable.indexOf(b.intervals.join(' ')))
})

// #################################

var bbTable = {
  Abb: 'G',
  Bbb: 'A',
  Cbb: 'A#',
  Dbb: 'C',
  Ebb: 'D',
  Fbb: 'D#',
  Gbb: 'F'
}

var sstable = {
  'A##': 'B',
  'B##': 'C#',
  'C##': 'D',
  'D##': 'E',
  'E##': 'F#',
  'F##': 'G',
  'G##': 'A'
}
// #################################
var chordNotesHacks = {
  2850: [0, 1, 3, 2, 4],
  2914: [0, 1, 3, 2, 4, 5]
}
// #################################

// C-flat.. -> Cb
function urlDecodeKey (key) {
  key = key.replace('-flat', 'b')
  key = key.replace('-sharp', '#')
  return key
}
// C# -> C-sharp
function urlEncodeKey (key) {
  key = key.replace('#', '-sharp')
  key = key.replace('b', '-flat')
  return key
}
// #->s /->_ ' '->-
function urlEncodeChord (chordName) {
  chordName = chordName.replace(/#/g, 'sharp')
  chordName = chordName.replace(/\//g, '_')
  chordName = chordName.replace(/ /g, '-')
  return chordName
}
function urlDecodeChord (chordName) {
  chordName = chordName.replace(/sharp/g, '#')
  chordName = chordName.replace(/_/g, '/')
  chordName = chordName.replace(/-/g, ' ')
  return chordName
}
// #################################
var oct3keyList =
  [['C', 'B#'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E', 'Fb'], ['F', 'E#'], ['F#', 'Gb'], ['G'], ['G#', 'Ab'], ['A'], ['A#', 'Bb'], ['B', 'Cb']]
oct3keyList = oct3keyList.concat(oct3keyList).concat(oct3keyList)

function chord2octave3highlightTable (chord) {
  var notes = chord.notes.map(note => { // remove bb
    if (note in bbTable) {
      return bbTable[note]
    } else {
      return note
    }
  })
  notes = notes.map(note => { // remove ##
    if (note in sstable) {
      return sstable[note]
    } else {
      return note
    }
  })
  if (chord.setNum in chordNotesHacks) { // correct order
    var oldNotes = [...notes]
    notes = notes.sort((a, b) => chordNotesHacks[chord.setNum].indexOf(oldNotes.indexOf(a)) - chordNotesHacks[chord.setNum].indexOf(oldNotes.indexOf(b)))
  }
  // make highlight table
  var highlightTable = Array(oct3keyList.length).fill(0)
  var startIndex = 0
  notes.forEach(note => {
    highlightTable[oct3keyList.findIndex((key, i) => {
      if (i < startIndex) {
        return false
      } else {
        if (key.some(k => k === note)) {
          startIndex = i
          return true
        } else {
          return false
        }
      }
    })] = 1
  })
  return highlightTable
}
// #################################
function url2ChordData (key, chordName) {
  return chordData[key].find(c => {
    if ((c.tonic + c.aliases[0]) === chordName) return true
    if (c.name === chordName) return true
    return false
  })
}
// #################################
function chordAlignMid (highlightTable) {
  if (highlightTable.slice(24).every(h => h === 0)) {
    return {
      highlightTable: Array(12).fill(0).concat(highlightTable.slice(0, 24)),
      octave: ['c3', 'c4', 'c5']
    }
  } else {
    return {
      highlightTable,
      octave: ['c4', 'c5', 'c6']
    }
  }
}
// #################################
// 'C4' -> '4'
function keyNameToOctave (name) {
  return name[name.length - 1]
}
// 'C4' -> 'C'
// 'F#4' -> 'F#'
// 'Db4' -> 'C#'
function keyNameToSynthNote (name) {
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
// #################################
var possibleOctaveList = [
  'c2,c3,c4',
  'c3,c4,c5',
  'c4,c5,c6',
  'c5,c6,c7'
]
export {
  chordData,
  urlDecodeKey,
  urlEncodeKey,
  urlEncodeChord,
  urlDecodeChord,
  chord2octave3highlightTable,
  url2ChordData,
  chordAlignMid,
  keyNameToOctave,
  keyNameToSynthNote,
  possibleOctaveList
}
