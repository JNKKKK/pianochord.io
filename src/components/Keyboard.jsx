import { h, Component } from 'preact'
import { scale } from '@tonaljs/scale'
import { note } from '@tonaljs/tonal'
import Key from './Key'

var bwMap = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']
var noteNames = []
var bws = [];
['c3', 'c4', 'c5'].map((tonic) => {
  noteNames = noteNames.concat(scale(tonic + ' chromatic').notes)
})
noteNames.map(noteName => {
  bws.push(bwMap[note(noteName).chroma])
})

export default class Keyboard extends Component {
  render () {
    return (
      <div className='keyboard-container'>
        {noteNames.map((noteName, i) => <Key noteName={noteName} bw={bws[i]} />)}
      </div>

    )
  }
}
