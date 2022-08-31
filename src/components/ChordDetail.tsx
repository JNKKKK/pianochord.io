import { Chord } from 'libs/chord'
import { h, Component } from 'preact'
import { intervalTable } from '../libs/db'

type ChordDetailProps = {
  chord: Chord
}

export default class ChordDetail extends Component<ChordDetailProps> {
  render() {
    let chord = this.props.chord
    return (
      <div className='chordDetail-container'>
        <h1>{chord.name}</h1>
        <div class='chordDetail-detail'>
          <div><b>Tonic</b> {chord.tonic}</div>
          <div><b>Interval</b> {chord.intervals.map(i => intervalTable[i].abbrev).join(', ')}</div>
          {
            chord.quality && chord.quality !== 'Unknown' &&
            <div><b>Quality</b> {chord.quality}</div>
          }
          {
            // if has fullname, display all alias
            (chord.fullName) &&
            <div><b>Aliases</b> {chord.alias.join(', ')}</div>
          }
          {
            // if no fullname, and has >1 alias, display the rest of alias
            (!chord.fullName && chord.alias.length > 1) &&
            <div><b>Aliases</b> {chord.alias.slice(1).join(', ')}</div>
          }
        </div>
      </div>
    )
  }
}
