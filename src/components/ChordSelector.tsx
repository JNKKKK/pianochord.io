import { h, Component } from 'preact'
import ChordThumbnail from './ChordThumbnail'
import { KeyName, keySimpleList } from '../libs/key'
import { urlEncodeKey, urlEncodeChord, chordFilterByKeyword } from '../libs/helper'
import { chords as Chords } from '../libs/db'

type ChordSelectorProps = {
  selectedKey: KeyName
}

type ChordSelectorState = {
  search: string
}

export default class ChordSelector extends Component<ChordSelectorProps, ChordSelectorState> {
  constructor(props: ChordSelectorProps) {
    super(props)
    this.state = { search: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ search: event.target.value })
    }
  }

  handleClick() {
  }

  render() {
    let selectedKey = this.props.selectedKey
    let chords = Chords[selectedKey].filter(chordFilterByKeyword(this.state.search))

    return (
      <div className='chordSelector-container'>
        <input type='text' placeholder='Search by keywords' value={this.state.search} onKeyUp={this.handleChange}
          className={'color-' + (keySimpleList.indexOf(selectedKey) + 1)} />
        <div className='chord-container'>
          {chords.map(c => (
            <a className={'chord color-' + (keySimpleList.indexOf(selectedKey) + 1)} onClick={this.handleClick} draggable={false}
              href={'/chord/' + urlEncodeKey(selectedKey) + '/' + urlEncodeChord(c.name)}>
              <ChordThumbnail chord={c} highlightColor={keySimpleList.indexOf(selectedKey) + 1} />
              <div className='name'>{c.shortName}</div>
            </a>
          ))}
          {chords.length == 0 &&
            <div className='missing-chord'>
              No matching chords found! To report missing chord definition, open an issue <a href="https://github.com/JNKKKK/pianochord.io/issues">here</a>. 
            </div>
          }
        </div>
      </div>
    )
  }
}
