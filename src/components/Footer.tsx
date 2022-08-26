import { h, Component } from 'preact'

export default class Footer extends Component {
    render() {
        return (
            <footer>
                <pre>
                    <b><a href='https://pianochord.io/' className="no-decoration">PianoChord.io</a></b> made with ❤ by <a href='https://nk.dev'>Enkai Ji</a>. Open sourced at <a href="https://github.com/JNKKKK/pianochord.io">Github</a>
                </pre>
            </footer>
        )
    }

}