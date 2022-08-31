import { h, Component } from 'preact'
import ChordThumbnail from './ChordThumbnail'
import { keySimpleList } from '../libs/key'
import { urlEncodeKey, urlEncodeChord } from '../libs/helper'
import { chords } from '../libs/db'

type ChordSelectorProps = {
  selectedKey: string
}

type ChordSelectorState = {
  search: string
}

export default class ChordSelector extends Component<ChordSelectorProps, ChordSelectorState> {
  constructor(props: ChordSelectorProps) {
    super(props)
    this.state = { search: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ search: event.target.value })
    }
  }

  render() {
    let selectedKey = this.props.selectedKey
    let chordDataList = chords[selectedKey]

    return (
      <div className='chordSelector-container'>
        <input type='text' placeholder='Search by keywords' value={this.state.search} onKeyUp={this.handleChange}
          className={'color-' + (keySimpleList.indexOf(selectedKey) + 1)} />
        <div className='chordSelector-chord-container'>
          {chordDataList.filter(chord => chord.names.some(name => name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1)).map(c => (
            <a className='chordSelector-chord' onClick={() => window.scrollTo(0, 0)}
              href={'/chord/' + urlEncodeKey(selectedKey) + '/' + urlEncodeChord(c.name)}>
              <ChordThumbnail chord={c} highlightColor={keySimpleList.indexOf(selectedKey) + 1} />
              <div className='chordSelector-chord-name'>{c.name}</div>
            </a>
          ))}
        </div>
      </div>
    )
  }
}
