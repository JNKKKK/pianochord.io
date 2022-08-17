import { h, Component, createRef } from 'preact'

const pixelRatio = 2
const width = 610
const height = 90


export default class Logo extends Component {
  constructor (props) {
    super(props)
    this.canvasRef = createRef()
    this.animate = this.animate.bind(this)
  }



  render () {
    return (
      <div className='logo-container'>
        PianoChord
      </div>
    )
  }
}
