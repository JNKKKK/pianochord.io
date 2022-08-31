import { h, Component, createRef } from 'preact'
import Key from './Key'
import { notes as allNotes } from '../libs/db'

type KeyboardProps = {
  offset: number,
  highlightTable?: boolean[],
  highlightColor?: number
}

export default class Keyboard extends Component<KeyboardProps> {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref);
    let div = this.ref.current as HTMLElement
    if (div.scrollWidth > div.clientWidth)
      div.scrollLeft = (div.scrollWidth - window.innerWidth) / 2
  }
  render() {
    let offset = 12 * (1 + this.props.offset)
    let notes = allNotes.slice(offset, offset + 36)
    let highlightTable = this.props.highlightTable ? this.props.highlightTable : Array(36).fill(0)
    let highlightColor = this.props.highlightColor ? this.props.highlightColor : 1
    return (
      <div ref={this.ref} className='keyboard-container'>
        {notes.map((note, i) =>
          <Key note={note} highlighted={highlightTable[i]} highlightColor={highlightColor} />
        )}
      </div>
    )
  }
}
