import { Fragment, h, Component } from 'preact'
import Keyboard from '../components/Keyboard'
import KeySelector from '../components/KeySelector'

export default class IndexPage extends Component {
  render () {
    return (
      <Fragment>
        <Keyboard />
        <KeySelector />
      </Fragment>
    )
  }
}
