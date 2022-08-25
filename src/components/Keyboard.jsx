import { h, Component } from 'preact'
import Key from './Key'
import { bwMap, chromaticScale } from '../libs/helper'
import { OctaveKeyCount } from '../libs/key'

export default class Keyboard extends Component {
  render ({ octave, highlightTable, highlightColor }) {
    if (!octave) octave = [3, 4, 5]
    let noteNames = []
    let bws = []
    octave.forEach((oct) => {
      noteNames = noteNames.concat(chromaticScale.map(str => (str + oct)))
    })
    noteNames.forEach((_, i) => {
      bws.push(bwMap[i % OctaveKeyCount])
    })
    
    if (!highlightTable) highlightTable = Array(noteNames.length).fill(0)
    if (!highlightColor) highlightColor = 1
    return (
      <div className='keyboard-container'>
        {noteNames.map((noteName, i) =>
          <Key noteName={noteName} bw={bws[i]} highlighted={highlightTable[i]} highlightColor={highlightColor} />
        )}
      </div>
    )
  }
}
