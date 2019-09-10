import { h, Component } from 'preact'
import piano from '../libs/audiosynth'

// 'C4' -> '4'
function keyNameToOctave (name) {
  return name[name.length - 1]
}
// 'C4' -> 'C'
// 'F#4' -> 'F#'
// 'Db4' -> 'C#'
function keyNameToSynthNote (name) {
  console.log(name)
  if (name.length === 2) {
    return name[0]
  } else if (name.length === 3) {
    if (name[1] === 'b') {
      var noteLetter = name[0]
      var previousNote = { D: 'C', E: 'D', G: 'F', A: 'G', B: 'A' }
      noteLetter = previousNote[noteLetter]
      return noteLetter + '#'
    } else if (name[1] === '#') {
      return name.slice(0, -1)
    }
  }
}

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

  render () {
    return (
      <div className={'keyboard-key ' + this.props.bw + (this.state.clicked ? ' clicked' : '')} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        <div className='keyboard-key-label'>{this.props.noteName}</div>
      </div>
    )
  }
}
