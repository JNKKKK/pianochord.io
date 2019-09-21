import { h, Component } from 'preact'
import { scale } from '@tonaljs/scale'
import { note } from '@tonaljs/tonal'
import Key from './Key'

var bwMap = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']
var noteNames = []
var bws = [];
['c3', 'c4', 'c5'].forEach((tonic) => {
  noteNames = noteNames.concat(scale(tonic + ' chromatic').notes)
})
noteNames.forEach(noteName => {
  bws.push(bwMap[note(noteName).chroma])
})
// console.log(noteNames)
export default class Keyboard extends Component {
  render ({ octave, highlightTable, highlightColor }) {
    if (highlightTable) {
      return (
        <div className='keyboard-container'>
          {noteNames.map((noteName, i) => <Key noteName={noteName} bw={bws[i]} highlighted={highlightTable[i]} highlightColor={highlightColor} />)}
        </div>
      )
    } else {
      return (
        <div className='keyboard-container'>
          {noteNames.map((noteName, i) => <Key noteName={noteName} bw={bws[i]} />)}
        </div>
      )
    }
  }
}
