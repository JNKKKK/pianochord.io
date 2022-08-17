import { h, Component, createRef } from 'preact'

const pixelRatio = 2
const width = 610
const height = 90


export default class Logo extends Component {
  constructor (props) {
    super(props)
  }



  render () {
    return (
      <div className='logo-container'>
        PianoChord
      </div>
    )
  }
}
