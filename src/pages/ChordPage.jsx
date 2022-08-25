import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard'
import KeySelector from '../components/KeySelector'
import { keySimpleList } from '../libs/key'
import ChordSelector from '../components/ChordSelector'
import ChordDetail from '../components/ChordDetail'
import Playbox from '../components/Playbox'
import { getHighlightTable, chordAlignMid, url2ChordData, possibleOctaveList, urlDecodeKey, urlDecodeChord } from '../libs/helper'

const MAXoctaveAdj = 1
const MINoctaveAdj = -1

export default class ChordPage extends Component {
  constructor (props) {
    super(props)
    this.raiseOctave = this.raiseOctave.bind(this)
    this.lowerOctave = this.lowerOctave.bind(this)
    this.state = { octaveAdj: 0 }
  }

  raiseOctave () {
    var octaveAdj = this.state.octaveAdj
    octaveAdj += 1
    if (octaveAdj > MAXoctaveAdj) octaveAdj = MAXoctaveAdj
    this.setState({ octaveAdj })
  }

  lowerOctave () {
    var octaveAdj = this.state.octaveAdj
    octaveAdj -= 1
    if (octaveAdj < MINoctaveAdj) octaveAdj = MINoctaveAdj
    this.setState({ octaveAdj })
  }

  render ({ selectedKey, selectedChord }) {
    selectedKey = urlDecodeKey(selectedKey)
    selectedChord = urlDecodeChord(selectedChord)
    if (selectedChord) {
      var chord = url2ChordData(selectedKey, selectedChord)
      var { highlightTable, octave } = chordAlignMid(getHighlightTable(chord))
      octave = possibleOctaveList[possibleOctaveList.indexOf(octave.join(',')) + this.state.octaveAdj].split(',')
      return (
        <Fragment>
          <Keyboard octave={octave} highlightTable={highlightTable} highlightColor={keySimpleList.indexOf(selectedKey) + 1} />
          <KeySelector selectedKey={selectedKey} />
          <Playbox octave={octave} highlightTable={highlightTable}
            raiseOctave={this.raiseOctave} lowerOctave={this.lowerOctave}
            risingDisabled={this.state.octaveAdj === MAXoctaveAdj} lowerDisabled={this.state.octaveAdj === MINoctaveAdj}
            color={keySimpleList.indexOf(selectedKey) + 1} />
          <ChordDetail chord={chord} />
          <ChordSelector selectedKey={selectedKey} />
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Keyboard />
          <KeySelector selectedKey={selectedKey} />
          <ChordSelector selectedKey={selectedKey} />
        </Fragment>
      )
    }
  }
}
