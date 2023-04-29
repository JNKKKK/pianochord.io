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
            <nav class="navbar">

                <div class="logo"><a href="/">PianoChord.io</a></div>

                <ul class="nav-links">

                    <input type="checkbox" id="checkbox_toggle" />
                    <label for="checkbox_toggle" class="hamburger">&#9776;</label>


                    <div class="menu">
                        <li><a className={window.location.pathname.startsWith("/chord") ? "active" : ''} href={this.props.chordUrl ? this.props.chordUrl : '/'}>Chords</a></li>
                        <li><a className={window.location.pathname.startsWith("/whiteboard") ? "active" : ''} href="/whiteboard">Whiteboard</a></li>
                        <li><a className={window.location.pathname.startsWith("/about") ? "active" : ''} href="/about">About</a></li>
                    </div>
                </ul>
            </nav>
        )
    }
}
