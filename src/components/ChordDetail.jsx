import { h, Component } from 'preact'

function getChordTitle (chord) {
  if (chord.name === chord.tonic + ' ') {
    return chord.name.slice(0, -1) + chord.aliases[0]
  } else {
    return chord.name
  }
}

export default class ChordDetail extends Component {
  render ({ selectedChord }) {
    // console.log(selectedKey, selectedChord)
    var chord = selectedChord
    return (
      <div className='chordDetail-container'>
        <h1>{getChordTitle(chord)}</h1>
        <div class='chordDetail-detail'>
          <div><b>Tonic</b>&emsp;{chord.tonic}</div>
          <div><b>Interval</b>&emsp;{chord.intervals.join(', ')}</div>
          {
            chord.quality && chord.quality !== 'Unknown' &&
            <div><b>Quality</b>&emsp;{chord.quality}</div>
          }
          {
            chord.type &&
            <div><b>Type</b>&emsp;{chord.type}</div>
          }
          {
            !((chord.name === chord.tonic + ' ') && (chord.aliases.length === 1)) &&
            <div><b>Aliases</b>&emsp;{chord.aliases.filter(a => a).map(a => chord.tonic + a).join(', ')}</div>
          }
        </div>
      </div>
    )
  }
}
