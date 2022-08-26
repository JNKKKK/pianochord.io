import { h, Component } from 'preact'
import { keyNameToSynthNote, keyNameToOctave, bwMap } from '../libs/helper'
import { bw } from '../libs/key'

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
    this.props.note.play()
  }

  handleMouseUp (e) {
    this.setState({ clicked: false })
  }

  render ({ note, highlighted, highlightColor }, { clicked }) {
    return (
      <div className={'keyboard-key ' + (note.bw === bw.white ? 'white' : 'black') + (clicked ? ' clicked' : '') + (highlighted ? ' active color-' + highlightColor : '')}
        onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        <div className='keyboard-key-label'>{note.toString()}</div>
      </div>
    )
  }
}
