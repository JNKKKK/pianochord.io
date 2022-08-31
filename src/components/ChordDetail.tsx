import { Chord } from 'libs/chord'
import { h, Component } from 'preact'
import { intervalTable } from '../libs/db'
import { ChevronRight } from './icon/ChevronRight'

type ChordDetailProps = {
  chord: Chord
}

export default class ChordDetail extends Component<ChordDetailProps> {
  render() {
    let chord = this.props.chord
    return (
      <div className='chordDetail-container'>
        <div className='information-container'>
          <h1>{chord.name}</h1>
          <div className='information'>
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
        <div className='inversion-container'>
          <div className='inversion-header'>
            <span>Inversions</span>
            <ChevronRight size={21} />
          </div>
          <div className='inversion'>

          </div>
        </div>
      </div>
    )
  }
}
