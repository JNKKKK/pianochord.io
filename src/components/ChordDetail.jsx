import { h, Component } from 'preact'
import { intervalTable } from '../libs/db'
import { getDisplayName } from '../libs/helper'

export default class ChordDetail extends Component {
  render ({ chord }) {
    return (
      <div className='chordDetail-container'>
        <h1>{getDisplayName(chord)}</h1>
        <div class='chordDetail-detail'>
          <div><b>Tonic</b>&emsp;{chord.tonic}</div>
          <div><b>Interval</b>&emsp;{chord.intervals.map(i => intervalTable[i].abbrev).join(', ')}</div>
          {
            chord.quality && chord.quality !== 'Unknown' &&
            <div><b>Quality</b>&emsp;{chord.quality}</div>
          }
          {
            (chord.names.length > 1) &&
            <div><b>Aliases</b>&emsp;{chord.names.slice(1).join(', ')}</div>
          }
        </div>
      </div>
    )
  }
}
