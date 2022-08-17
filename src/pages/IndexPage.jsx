import { h, Component } from 'preact'
import KeySelector from '../components/KeySelector'
import Logo from '../components/Logo'

export default class IndexPage extends Component {
  render () {
    return (
      <div className='indexPage-container'>
        <Logo />
        <h2>A Reference to a Comprehensive Collection of Piano Chords</h2>
        <div className='tip1 animated flipInX'>Select a root key to continue</div>
        <div className='tip2 animated flipInX'>
          <KeySelector />
        </div>
      </div>
    )
  }
}
