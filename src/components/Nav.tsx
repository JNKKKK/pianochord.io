import { h, Component } from 'preact'
import { Music } from './icon/Music'
import { Clipboard } from './icon/Clipboard'

type NavProps = {
    chordUrl?: string
}

type NavState = {}

export default class Nav extends Component<NavProps, NavState> {
    constructor(props: NavProps) {
        super(props)
    }

    render() {
        return (
            <div className='nav-container'>
                <a className={window.location.pathname.startsWith("/chord") ? "active" : ''} href={this.props.chordUrl ? this.props.chordUrl : '/'}><Music size={20} />Chords</a>
                <a className={window.location.pathname.startsWith("/whiteboard") ? "active" : ''} href="/whiteboard"><Clipboard size={20} />Whiteboard</a>
            </div>

        )
    }
}
