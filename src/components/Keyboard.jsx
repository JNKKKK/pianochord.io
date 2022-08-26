import { h, Component } from 'preact'
import Key from './Key'
import { bwMap, chromaticScale, notes as allNotes } from '../libs/helper'
import { OctaveKeyCount } from '../libs/key'

export default class Keyboard extends Component {
  render ({ offset, highlightTable, highlightColor }) {
    // if (!octave) octave = [3, 4, 5]
    // let noteNames = []
    // let bws = []
    // octave.forEach((oct) => {
    //   noteNames = noteNames.concat(chromaticScale.map(str => (str + oct)))
    // })
    // noteNames.forEach((_, i) => {
    //   bws.push(bwMap[i % OctaveKeyCount])
    // })

    offset = 12 + offset * 12
    let notes = allNotes.slice(offset, offset + 36)

    if (!highlightTable) highlightTable = Array(36).fill(0)
    if (!highlightColor) highlightColor = 1
    return (
      <div className='keyboard-container'>
        {notes.map((note, i) =>
          <Key note={note} highlighted={highlightTable[i]} highlightColor={highlightColor} />
        )}
      </div>
    )
  }
}
