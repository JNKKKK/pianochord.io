import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard.jsx'
import KeySelector, { keySelectorList } from '../components/KeySelector.jsx'
import ChordSelector from '../components/ChordSelector.jsx'
import { urlDecodeKey, urlDecodeChord, url2ChordData, chord2octave3highlightTable, chordAlignMid, possibleOctaveList } from '../libs/helper'
import ChordDetail from '../components/ChordDetail.jsx'
import Playbox from '../components/Playbox.jsx'

const MAXoctaveAdj = 1
const MINoctaveAdj = -1

export default class ChordPage extends Component {
  constructor (props) {
    super(props)
    this.risingOctave = this.risingOctave.bind(this)
    this.lowerOctave = this.lowerOctave.bind(this)
    this.state = { octaveAdj: 0 }
  }

  risingOctave () {
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
    // console.log(selectedKey, selectedChord)
    selectedKey = urlDecodeKey(selectedKey)
    selectedChord = urlDecodeChord(selectedChord)
    if (selectedChord) {
      var chord = url2ChordData(selectedKey, selectedChord)
      var { highlightTable, octave } = chordAlignMid(chord2octave3highlightTable(chord))
      octave = possibleOctaveList[possibleOctaveList.indexOf(octave.join(',')) + this.state.octaveAdj].split(',')
      return (
        <Fragment>
          <Keyboard octave={octave} highlightTable={highlightTable} highlightColor={keySelectorList.indexOf(selectedKey) + 1} />
          <KeySelector selectedKey={selectedKey} />
          <Playbox octave={octave} highlightTable={highlightTable}
            risingOctave={this.risingOctave} lowerOctave={this.lowerOctave}
            risingDisabled={this.state.octaveAdj === MAXoctaveAdj} lowerDisabled={this.state.octaveAdj === MINoctaveAdj}
            color={keySelectorList.indexOf(selectedKey) + 1} />
          <ChordDetail selectedChord={chord} />
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
