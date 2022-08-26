import { h, Component } from 'preact'
import Key from './Key'
import { notes as allNotes } from '../libs/db'


export default class Keyboard extends Component {
  render ({ offset, highlightTable, highlightColor }) {
    offset = 12 * (1 + offset)
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
