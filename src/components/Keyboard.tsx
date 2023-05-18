import { Component, createRef } from 'preact'
import Key from './Key'
import { notes as allNotes } from '../libs/db'

type KeyboardProps = {
    offset: number,
    highlightTable?: boolean[],
    highlightColor?: number
}

export default class Keyboard extends Component<KeyboardProps> {
    ref = createRef();

    componentDidUpdate() {
        // scroll the first highlighted key into view
        if (this.props.highlightTable) {
            let div = this.ref.current as HTMLElement
            const firstIndex = this.props.highlightTable.findIndex(item => item === true);
            const lastIndex = this.props.highlightTable.lastIndexOf(true);
            (div.childNodes[lastIndex] as HTMLElement).scrollIntoView();
            (div.childNodes[firstIndex] as HTMLElement).scrollIntoView();
            window.scrollTo(0, 0)
        }
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
