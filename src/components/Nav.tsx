import { h, Component } from 'preact'
import netlifyIdentity from 'netlify-identity-widget';

type NavProps = {
    chordUrl?: string
}

type NavState = {}

export default class Nav extends Component<NavProps, NavState> {
    constructor(props: NavProps) {
        super(props)
        this.handleHamburgerClick = this.handleHamburgerClick.bind(this)
    }

    componentDidUpdate() {
        document.body.classList.remove("disable-scrolling")
    }

    handleHamburgerClick(e: MouseEvent) {
        let checkbox = (e.target as HTMLLabelElement).control as HTMLInputElement
        if (checkbox.checked) {
            document.body.classList.remove("disable-scrolling")
        } else {
            document.body.classList.add("disable-scrolling")
        }
    }

    render() {
        let avatarUrl = netlifyIdentity.currentUser()?.user_metadata?.avatar_url ? netlifyIdentity.currentUser()?.user_metadata?.avatar_url :
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"

        return (
            <nav class="navbar">
                <div class="logo"><a href="/">PianoChord.io</a></div>
                <ul class="nav-links">
                    <input type="checkbox" id="checkbox_toggle" checked={false} />
                    <label for="checkbox_toggle" class="hamburger" onClick={this.handleHamburgerClick}>&#9776;</label>
                    <div class="menu">
                        <li><a className={window.location.pathname.startsWith("/chord") ? "active" : ''} href={this.props.chordUrl ? this.props.chordUrl : '/'}>Chords</a></li>
                        {/* <li><a className={window.location.pathname.startsWith("/whiteboard") ? "active" : ''} href="/whiteboard">Whiteboard</a></li> */}
                        <li><a className={window.location.pathname.startsWith("/about") ? "active" : ''} href="/about">About</a></li>
                        <li>
                            {netlifyIdentity.currentUser() == null ? <a onClick={() => { netlifyIdentity.open(); }}>Log in</a>
                                :
                                <a onClick={() => { netlifyIdentity.logout(); }}><img src={avatarUrl} />Log out</a>
                            }
                        </li>

                    </div>
                </ul>
            </nav>
        )
    }
}
