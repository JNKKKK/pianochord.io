import { h, Component } from 'preact'
import './scss/App.scss'
import Router from 'preact-router'
import IndexPage from './pages/indexPage'
import ChordPage from './pages/ChordPage'
import Page404 from './pages/404Page'

export default class App extends Component {
  render () {
    return (
      <Router>
        <IndexPage path='/' />
        <ChordPage path='/chord/:selectedKey/:selectedChord?' />
        <Page404 default />
      </Router>
    )
  }
}
