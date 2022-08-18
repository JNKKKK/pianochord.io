import { h, Component } from 'preact'
import piano from '../libs/audiosynth'
import { chromaticScale, keyNameToSynthNote, keyNameToOctave } from '../libs/myhelper'

export default class Playbox extends Component {
  constructor (props) {
    super(props)
    this.playChord = this.playChord.bind(this)
    this.playEachNote = this.playEachNote.bind(this)
  }

  playChord (playNotes) {
    playNotes.forEach(note =>
      piano.play(keyNameToSynthNote(note), keyNameToOctave(note), 2)
    )
  }

  playEachNote (playNotes) {
    playNotes.forEach((note, i) =>
      setTimeout(() => piano.play(keyNameToSynthNote(note), keyNameToOctave(note), 2), 300 * i)
    )
  }

  render ({ octave, highlightTable, raiseOctave, lowerOctave, risingDisabled, lowerDisabled, color }) {
    var noteNames = []
    octave.forEach((oct) => {
      noteNames = noteNames.concat(chromaticScale.map(str => (str + oct)))
    })
    var playNotes = noteNames.filter((note, i) => highlightTable[i])
    return (
      <div class='playbox-container'>
        <button type='button' className={'color-' + color} onClick={(e) => this.playChord(playNotes)}>&nbsp;▶ Play&nbsp;</button>
        <button type='button' className={'color-' + color} onClick={(e) => this.playEachNote(playNotes)}>▶ Play each note</button>
        <button type='button' className={'color-' + color} disabled={lowerDisabled} onClick={lowerOctave}>↓&nbsp;Lower octave</button>
        <button type='button' className={'color-' + color} disabled={risingDisabled} onClick={raiseOctave}>↑&nbsp;Rising octave</button>
      </div>
    )
  }
}
