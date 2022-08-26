import { h, Component } from 'preact'
import { notes as allNotes } from '../libs/db'

export default class Playbox extends Component {
  constructor (props) {
    super(props)
    this.playChord = this.playChord.bind(this)
    this.playEachNote = this.playEachNote.bind(this)
  }

  playChord (notes) {
    notes.forEach(note => note.play())
  }

  playEachNote (notes) {
    notes.forEach((note, i) =>
      setTimeout(() => note.play(), 300 * i)
    )
  }

  render ({ offset, highlightTable, raiseOctave, lowerOctave, risingDisabled, lowerDisabled, color }) {
    offset = 12 * (1 + offset)
    let notes = allNotes.slice(offset, offset + 36)
    let highlightedNotes = notes.filter((_, i) => highlightTable[i])

    return (
      <div class='playbox-container'>
        <button type='button' className={'color-' + color} onClick={(e) => this.playChord(highlightedNotes)}>&nbsp;▶ Play&nbsp;</button>
        <button type='button' className={'color-' + color} onClick={(e) => this.playEachNote(highlightedNotes)}>▶ Play each note</button>
        <button type='button' className={'color-' + color} disabled={lowerDisabled} onClick={lowerOctave}>↓&nbsp;Lower octave</button>
        <button type='button' className={'color-' + color} disabled={risingDisabled} onClick={raiseOctave}>↑&nbsp;Rising octave</button>
      </div>
    )
  }
}
