import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard'
import KeySelector from '../components/KeySelector'
import { keySimpleList } from '../libs/key'
import ChordSelector from '../components/ChordSelector'
import ChordDetail from '../components/ChordDetail'
import Playbox from '../components/Playbox'
import { getHighlightTable, chordAlignMid, urlDecodeKey, urlDecodeChord, findChordByName } from '../libs/helper'

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
    let octaveAdj = this.state.octaveAdj
    octaveAdj += 1
    if (octaveAdj > MAXoctaveAdj) octaveAdj = MAXoctaveAdj
    this.setState({ octaveAdj })
  }

  lowerOctave () {
    let octaveAdj = this.state.octaveAdj
    octaveAdj -= 1
    if (octaveAdj < MINoctaveAdj) octaveAdj = MINoctaveAdj
    this.setState({ octaveAdj })
  }

  render ({ selectedKey, selectedChord }) {
    selectedKey = urlDecodeKey(selectedKey)
    if (selectedChord) {
      selectedChord = urlDecodeChord(selectedChord)
      let chord = findChordByName(selectedKey, selectedChord)
      let highlightTable  = chordAlignMid(getHighlightTable(chord))
      return (
        <Fragment>
          <Keyboard offset={this.state.octaveAdj} highlightTable={highlightTable} highlightColor={keySimpleList.indexOf(selectedKey) + 1} />
          <KeySelector selectedKey={selectedKey} />
          <Playbox offset={this.state.octaveAdj} highlightTable={highlightTable}
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
          <Keyboard offset={0} />
          <KeySelector selectedKey={selectedKey} />
          <ChordSelector selectedKey={selectedKey} />
        </Fragment>
      )
    }
  }
}
