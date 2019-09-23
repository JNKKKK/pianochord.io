import { Fragment, h, Component } from 'preact'
import './scss/App.scss'
import Router from 'preact-router'
import IndexPage from './pages/IndexPage.jsx'
import ChordPage from './pages/ChordPage.jsx'
import Page404 from './pages/404Page.jsx'

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
