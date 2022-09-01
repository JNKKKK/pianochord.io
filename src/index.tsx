import { Fragment, h, Component, render } from 'preact'
import Router from 'preact-router'
import IndexPage from './pages/IndexPage'
import ChordPage from './pages/ChordPage'
import Page404 from './pages/404Page'
import Footer from './components/Footer'

import './scss/App.scss'

class App extends Component {
    render() {
        return (
            <Fragment>
                <div className='wrapper'>
                    <Router>
                        <IndexPage path='/' />
                        <ChordPage path='/chord/:selectedKey/:selectedChord?/:inversion?' />
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
