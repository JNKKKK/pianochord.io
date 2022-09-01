import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard'
import KeySelector from '../components/KeySelector'
import { Key, keySimpleList } from '../libs/key'
import ChordSelector from '../components/ChordSelector'
import ChordDetail from '../components/ChordDetail'
import Playbox from '../components/Playbox'
import { getHighlightTable, chordAlignMid, urlDecodeKey, urlDecodeChord, findChordByName } from '../libs/helper'

const MAXoctaveAdj = 1
const MINoctaveAdj = -1

type ChordPageProps = {
  selectedKey?: string,
  selectedChord?: string,
  path?: string,
  inversion?: string,
}

type ChordPageState = {
  octaveAdj: number,
}

export default class ChordPage extends Component<ChordPageProps, ChordPageState> {
  constructor(props: ChordPageProps) {
    super(props)
    this.raiseOctave = this.raiseOctave.bind(this)
    this.lowerOctave = this.lowerOctave.bind(this)
    this.urlDecode = this.urlDecode.bind(this)
    this.state = { octaveAdj: 0 }
  }

  raiseOctave() {
    let octaveAdj = this.state.octaveAdj
    octaveAdj += 1
    if (octaveAdj > MAXoctaveAdj) octaveAdj = MAXoctaveAdj
    this.setState({ octaveAdj })
  }

  lowerOctave() {
    let octaveAdj = this.state.octaveAdj
    octaveAdj -= 1
    if (octaveAdj < MINoctaveAdj) octaveAdj = MINoctaveAdj
    this.setState({ octaveAdj })
  }

  urlDecode() {
    let selectedKey = urlDecodeKey(this.props.selectedKey)
    let selectedChord = urlDecodeChord(this.props.selectedChord)
    let inversion
    if (!this.props.inversion) {
      inversion = 0
    } else {
      inversion = parseInt(this.props.inversion)
      if (isNaN(inversion)) inversion = 0
    }
    return { selectedKey, selectedChord, inversion }
  }

  render() {
    let { selectedKey, selectedChord, inversion } = this.urlDecode()
    if (!selectedKey) {
      window.location.href = "/404";
      return
    }
    if (!keySimpleList.includes(selectedKey)) {
      window.location.href = "/404";
      return
    }

    if (selectedChord) {
      let chord = findChordByName(selectedKey, selectedChord)
      if (chord === undefined) {
        window.location.href = "/404";
        return
      }
      let highlightTable, colorIndex
      if (inversion === 0) {
        highlightTable = chordAlignMid(getHighlightTable(chord))
        colorIndex = keySimpleList.indexOf(selectedKey) + 1
      } else {
        if (chord.inversions.length < inversion) {
          window.location.href = "/404"
          return
        }
        highlightTable = chordAlignMid(getHighlightTable(chord.inversions[inversion - 1]))
        colorIndex = keySimpleList.map(str => Key[str]).indexOf(chord.inversions[inversion - 1].key) + 1
      }
      return (
        <Fragment>
          <Keyboard offset={this.state.octaveAdj} highlightTable={highlightTable} highlightColor={colorIndex} />
          <KeySelector selectedKey={selectedKey} />
          <Playbox offset={this.state.octaveAdj} highlightTable={highlightTable}
            raiseOctave={this.raiseOctave} lowerOctave={this.lowerOctave}
            risingDisabled={this.state.octaveAdj === MAXoctaveAdj} lowerDisabled={this.state.octaveAdj === MINoctaveAdj}
            color={keySimpleList.indexOf(selectedKey) + 1} />
          <ChordDetail chord={chord} inversion={inversion} />
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
