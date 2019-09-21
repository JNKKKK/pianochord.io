import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard'
import KeySelector, { keySelectorList } from '../components/KeySelector'
import ChordSelector from '../components/ChordSelector'
import { urlDecodeKey, urlDecodeChord, url2ChordData, chord2octave3highlightTable } from '../libs/helper'
import ChordDetail from '../components/ChordDetail'

export default class ChordPage extends Component {
  render ({ selectedKey, selectedChord }) {
    // console.log(selectedKey, selectedChord)
    selectedKey = urlDecodeKey(selectedKey)
    selectedChord = urlDecodeChord(selectedChord)
    if (selectedChord) {
      var chord = url2ChordData(selectedKey, selectedChord)
      // var {highlightTable,octave} = xxx(chord)
      return (
        <Fragment>
          <Keyboard highlightTable={chord2octave3highlightTable(chord)} highlightColor={keySelectorList.indexOf(selectedKey) + 1} />
          <KeySelector selectedKey={selectedKey} />
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
