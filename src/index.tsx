import { Fragment, h, Component, render } from 'preact'
import Router, { RouterOnChangeArgs } from 'preact-router'
import Match from 'preact-router/match';
import IndexPage from './pages/IndexPage'
import ChordPage from './pages/ChordPage'
import Page404 from './pages/404Page'
import Footer from './components/Footer'
import WhiteBoardPage from './pages/WhiteBoardPage'
import Nav from './components/Nav';
import { polyfill } from 'mobile-drag-drop';

import './scss/App.scss'

type AppProps = {
}

type AppState = {
    chordUri: string
}


class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props)
        this.state = { chordUri: '/chord/C' }
        this.handleRoute = this.handleRoute.bind(this)
    }

    handleRoute(e: RouterOnChangeArgs) {
        let url = e.url
        if (e.url.startsWith("/chord")) this.setState({ chordUri: url })
    }

    render() {
        return (
            <Fragment>
                <div className='wrapper'>
                    <Match path="/">
                        {({ url }: { url: string }) => {
                            if (url.startsWith("/chord") || url.startsWith("/whiteboard"))
                                return <Nav chordUrl={this.state.chordUri} />
                        }}
                    </Match>
                    <Router onChange={this.handleRoute}>
                        <IndexPage path='/' />
                        <ChordPage path='/chord/:selectedKey/:selectedChord?/:inversion?' />
                        <WhiteBoardPage path='/whiteboard' />
                        <Page404 default />
                    </Router>
                </div>
                <Footer />
            </Fragment>
        )
    }
}

const mountNode = document.getElementById('app')
if (mountNode) render(<App />, mountNode)
