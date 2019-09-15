import { h, Component } from 'preact'
import ChordThumbnail from './ChordThumbnail'
import { chordData } from '../libs/helper'

// ChordData -> DisplayName
function getDisplayName (chord) {
  if (chord.name.length > 17) {
    return chord.tonic + chord.aliases[0]
  }
  if (chord.name === chord.tonic + ' ') {
    return chord.name.slice(0, -1) + chord.aliases[0]
  } else {
    return chord.name
  }
}

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
    var chordDataList = chordData[selectedKey]
    console.log(chordDataList)
    return (
      <div className='chordSelector-container'>
        <input type='text' placeholder='Search by keywords' value={this.state.search} onKeyUp={this.handleChange} />
        <div className='chordSelector-chord-container'>
          {chordDataList.filter(chord => chord.possibleNames.some(name => name.toLowerCase().indexOf(search.toLowerCase()) !== -1)).map(c => (
            <div className='chordSelector-chord'>
              <ChordThumbnail />
              <div className='chordSelector-chord-name'>{getDisplayName(c)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
// Love You So Much ~~
