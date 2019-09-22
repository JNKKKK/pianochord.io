import { Fragment, h, Component } from 'preact'
import './scss/App.scss'
import Router from 'preact-router'
import IndexPage from './pages/indexPage'
import ChordPage from './pages/ChordPage'
import Page404 from './pages/404Page'

export default class App extends Component {
  render () {
    return (
      <Fragment>
        <div className='wrapper'>
          <Router>
            <IndexPage path='/' />
            <ChordPage path='/chord/:selectedKey/:selectedChord?' />
            <Page404 default />
          </Router>
        </div>
        <footer><a href='/'>PianoChord.io</a>&nbsp;made with ❤ by Enkai Ji</footer>
      </Fragment>
    )
  }
}
