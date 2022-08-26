import { h, Component } from 'preact'
import ChordThumbnail from './ChordThumbnail'
import { keySimpleList } from '../libs/key'
import { getDisplayName, urlEncodeKey, urlEncodeChord } from '../libs/helper'
import { chords } from '../libs/db'

export default class ChordSelector extends Component {
  constructor (props) {
    super(props)
    this.state = { search: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ search: event.target.value })
  }

  render ({ selectedKey }, { search }) {
    let chordDataList = chords[selectedKey]

    return (
      <div className='chordSelector-container'>
        <input type='text' placeholder='Search by keywords' value={search} onKeyUp={this.handleChange}
          className={'color-' + (keySimpleList.indexOf(selectedKey) + 1)} />
        <div className='chordSelector-chord-container'>
          {chordDataList.filter(chord => chord.names.some(name => name.toLowerCase().indexOf(search.toLowerCase()) !== -1)).map(c => (
            <a className='chordSelector-chord' onClick={() => window.scrollTo(0, 0)}
              href={'/chord/' + urlEncodeKey(selectedKey) + '/' + urlEncodeChord(getDisplayName(c))}>
              <ChordThumbnail chord={c} highlightColor={keySimpleList.indexOf(selectedKey) + 1} />
              <div className='chordSelector-chord-name'>{getDisplayName(c)}</div>
            </a>
          ))}
        </div>
      </div>
    )
  }
}
