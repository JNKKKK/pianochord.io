import { Fragment, h, Component, render } from 'preact'
import Router from 'preact-router'
import IndexPage from './pages/IndexPage'
import ChordPage from './pages/ChordPage'
import Page404 from './pages/404Page'

import './scss/App.scss'

class App extends Component {
    render() {
        return (
            <Fragment>
                <div className='wrapper'>
                    <Router>
                        <IndexPage path='/' />
                        <ChordPage path='/chord/:selectedKey/:selectedChord?' />
                        <Page404 default />
                    </Router>
                </div>
                <footer><pre>
                    <b><a href='https://pianochord.io/' className="no-decoration">PianoChord.io</a></b> made with ❤ by <a href='https://nk.dev'>Enkai Ji</a>. Open sourced at <a href="https://github.com/JNKKKK/pianochord.io">Github</a>
                </pre></footer>
            </Fragment>
        )
    }
}

const mountNode = document.getElementById('app')
if (mountNode) render(<App />, mountNode)
