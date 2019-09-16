import { h, Component } from 'preact'
import { bbTable, chordNotesHacks, sstable } from '../libs/helper'

const whiteWidth = 9
const whiteHeight = 40
const blackWidth = 4.5
const blackHeight = 25
var bwMap = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']
var blackOccurIndex = [1, 3, 6, 8, 10]
blackOccurIndex = blackOccurIndex.concat(blackOccurIndex.map(i => i + bwMap.length)).concat(blackOccurIndex.map(i => i + bwMap.length * 2))
var whiteOccurIndex = [0, 2, 4, 5, 7, 9, 11]
whiteOccurIndex = whiteOccurIndex.concat(whiteOccurIndex.map(i => i + bwMap.length)).concat(whiteOccurIndex.map(i => i + bwMap.length * 2))
bwMap = bwMap.concat(bwMap).concat(bwMap)
var keyList =
  [['C', 'B#'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E', 'Fb'], ['F', 'E#'], ['F#', 'Gb'], ['G'], ['G#', 'Ab'], ['A'], ['A#', 'Bb'], ['B', 'Cb']]
keyList = keyList.concat(keyList).concat(keyList)

function whiteIfActive (i, highlightTable) {
  return highlightTable[whiteOccurIndex[i]]
}

function blackIfActive (i, highlightTable) {
  return highlightTable[blackOccurIndex[i]]
}

export default class ChordThumbnail extends Component {
  render ({ notes, setNum }) {
    notes = notes.map(note => { // remove bb
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
    if (setNum in chordNotesHacks) { // correct order
      var oldNotes = [...notes]
      notes = notes.sort((a, b) => chordNotesHacks[setNum].indexOf(oldNotes.indexOf(a)) - chordNotesHacks[setNum].indexOf(oldNotes.indexOf(b)))
    }
    // make highlight table
    var highlightTable = Array(keyList.length).fill(0)
    var startIndex = 0
    notes.forEach(note => {
      highlightTable[keyList.findIndex((key, i) => {
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
    // console.log(highlightTable)
    return (
      <svg className='ChordThumbnail-svg' width={whiteWidth * 7 * 3} height={whiteHeight}>
        {[...Array(7 * 3).keys()].map(i => (
          <rect className={'white' + (whiteIfActive(i, highlightTable) ? ' active' : '')}
            width={whiteWidth} height={whiteHeight} x={whiteWidth * i} />
        ))}
        {[...Array(5 * 3).keys()].map(i => (
          <rect className={'black' + (blackIfActive(i, highlightTable) ? ' active' : '')}
            width={blackWidth} height={blackHeight}
            x={whiteWidth * (bwMap.slice(0, blackOccurIndex[i]).filter(bw => bw === 'white').length) - blackWidth / 2} />
        ))}
      </svg>
    )
  }
}
