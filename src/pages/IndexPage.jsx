import { h, Component } from 'preact'
import KeySelector from '../components/KeySelector.jsx'
import Logo from '../components/Logo.jsx'

export default class IndexPage extends Component {
  render () {
    return (
      <div className='indexPage-container'>
        <Logo />
        <h2>A place to explore piano chords freely</h2>
        <div className='tip1 animated flipInX'>Select a root key to continue</div>
        <div className='tip2 animated flipInX'>
          <KeySelector />
        </div>
      </div>
    )
  }
}
