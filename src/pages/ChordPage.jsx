import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard'
import KeySelector from '../components/KeySelector'
import ChordSelector from '../components/ChordSelector'
import { urlDecodeKey, urlDecodeChord } from '../libs/helper'
import ChordDetail from '../components/ChordDetail'

export default class ChordPage extends Component {
  render ({ selectedKey, selectedChord }) {
    // console.log(selectedKey, selectedChord)
    if (selectedChord) {
      return (
        <Fragment>
          <Keyboard />
          <KeySelector selected={urlDecodeKey(selectedKey)} />
          <ChordDetail selectedKey={urlDecodeKey(selectedKey)} selectedChord={urlDecodeChord(selectedChord)} />
          <ChordSelector selectedKey={urlDecodeKey(selectedKey)} />
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Keyboard />
          <KeySelector selected={urlDecodeKey(selectedKey)} />
          <ChordSelector selectedKey={urlDecodeKey(selectedKey)} />
        </Fragment>
      )
    }
  }
}
