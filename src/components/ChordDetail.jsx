import { h, Component } from 'preact'
import { chordData } from '../libs/helper'

function displayName2ChordData (key, chordName) {
  return chordData[key].find(c => {
    if ((c.tonic + c.aliases[0]) === chordName) return true
    if (c.name === chordName) return true
    return false
  })
}

function getChordTitle (chord) {
  if (chord.name === chord.tonic + ' ') {
    return chord.name.slice(0, -1) + chord.aliases[0]
  } else {
    return chord.name
  }
}

export default class ChordDetail extends Component {
  render ({ selectedKey, selectedChord }) {
    console.log(selectedKey, selectedChord)
    var chord = displayName2ChordData(selectedKey, selectedChord)
    return (
      <div>
        {getChordTitle(chord)}
      </div>
    )
  }
}
