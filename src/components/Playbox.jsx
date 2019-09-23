import { h, Component } from 'preact'
import { scale } from '../libs/@tonaljs/scale/index.esnext'
import piano from '../libs/audiosynth'
import { keyNameToSynthNote, keyNameToOctave } from '../libs/helper'

export default class Playbox extends Component {
  constructor (props) {
    super(props)
    this.playChord = this.playChord.bind(this)
    this.playEachNote = this.playEachNote.bind(this)
  }

  playChord (playNotes, e) {
    playNotes.forEach(note =>
      piano.play(keyNameToSynthNote(note), keyNameToOctave(note), 2)
    )
  }

  playEachNote (playNotes, e) {
    playNotes.forEach((note, i) =>
      setTimeout(() => piano.play(keyNameToSynthNote(note), keyNameToOctave(note), 2), 300 * i)
    )
  }

  render ({ octave, highlightTable, risingOctave, lowerOctave, risingDisabled, lowerDisabled, color }) {
    var noteNames = []
    octave.forEach((tonic) => {
      noteNames = noteNames.concat(scale(tonic + ' chromatic').notes)
    })
    var playNotes = noteNames.filter((note, i) => highlightTable[i] === 1)
    return (
      <div class='playbox-container'>
        <button type='button' className={'color-' + color} onClick={(e) => this.playChord(playNotes, e)}>&nbsp;▶ Play&nbsp;</button>
        <button type='button' className={'color-' + color} onClick={(e) => this.playEachNote(playNotes, e)}>▶ Play each note</button>
        <button type='button' className={'color-' + color} disabled={lowerDisabled} onClick={lowerOctave}>🡫&nbsp;Lower octave</button>
        <button type='button' className={'color-' + color} disabled={risingDisabled} onClick={risingOctave}>🡩&nbsp;Rising octave</button>
      </div>
    )
  }
}
