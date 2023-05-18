import { Note } from 'libs/note'
import { Component } from 'preact'
import { bw } from '../libs/key'

type KeyProps = {
    note: Note,
    highlighted: boolean,
    highlightColor: number,
}

type KeyState = {
    clicked: boolean
}

export default class Key extends Component<KeyProps, KeyState> {
    constructor(props: KeyProps) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.pageMouseUp = this.pageMouseUp.bind(this)
        this.state = { clicked: false }
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.pageMouseUp, false)
    }

    pageMouseUp() {
        if (this.state.clicked === false) {
            return
        }
        this.setState({ clicked: false })
    }

    handleMouseDown() {
        this.setState({ clicked: true })
        this.props.note.play()
    }

    handleMouseUp() {
        this.setState({ clicked: false })
    }

    render() {
        let note = this.props.note
        return (
            <div className={'keyboard-key ' + (note.bw === bw.white ? 'white' : 'black') + (this.state.clicked ? ' clicked' : '') + (this.props.highlighted ? ' active color-' + this.props.highlightColor : '')}
                onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                <div className='keyboard-key-label'>{note.toString()}</div>
            </div>
        )
    }
}
