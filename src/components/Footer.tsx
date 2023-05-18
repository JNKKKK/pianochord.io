import { Component } from 'preact'
import { Github } from './icon/Github'

export default class Footer extends Component {
    render() {
        return (
            <footer>
                <pre>
                    <b><a href='https://pianochord.io/' className="no-decoration">PianoChord.io</a></b> made with ❤ by <a href='https://nk.dev'>Enkai Ji</a>.
                </pre>
                <pre>
                    Open sourced at <Github size={12} /> <a href="https://github.com/JNKKKK/pianochord.io">Github</a>
                </pre>
            </footer>
        )
    }

}