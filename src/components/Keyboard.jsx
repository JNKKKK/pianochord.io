import { h, Component } from 'preact'
import { scale } from '../libs/@tonaljs/scale/index.esnext'
import { note } from '../libs/@tonaljs/tonal/index.esnext'
import Key from './Key'

var bwMap = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']

export default class Keyboard extends Component {
  render ({ octave, highlightTable, highlightColor }) {
    if (!octave) octave = ['c3', 'c4', 'c5']
    // build noteNames list
    var noteNames = []
    var bws = []
    octave.forEach((tonic) => {
      noteNames = noteNames.concat(scale(tonic + ' chromatic').notes)
    })
    noteNames.forEach(noteName => {
      bws.push(bwMap[note(noteName).chroma])
    })
    //
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
