import { h, Component } from 'preact'
import piano from '../libs/audiosynth'
import { keyNameToSynthNote, keyNameToOctave } from '../libs/myhelper'

export default class Key extends Component {
  constructor (props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.pageMouseUp = this.pageMouseUp.bind(this)
    this.state = { clicked: false }
  }

  componentDidMount () {
    window.addEventListener('mouseup', this.pageMouseUp, false)
  }

  pageMouseUp (e) {
    if (this.state.clicked === false) {
      return
    }
    this.setState({ clicked: false })
  }

  handleMouseDown (e) {
    this.setState({ clicked: true })
    piano.play(
      keyNameToSynthNote(this.props.noteName),
      keyNameToOctave(this.props.noteName),
      2
    )
  }

  handleMouseUp (e) {
    this.setState({ clicked: false })
  }

  render ({ noteName, bw, highlighted, highlightColor }, { clicked }) {
    return (
      <div className={'keyboard-key ' + bw + (clicked ? ' clicked' : '') + (highlighted ? ' active color-' + highlightColor : '')}
        onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        <div className='keyboard-key-label'>{noteName}</div>
      </div>
    )
  }
}
