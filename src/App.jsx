import { h, Component } from 'preact'
import Keyboard from './components/Keyboard'
import './scss/App.scss'

export default class App extends Component {
  render () {
    return (
      <div>
        <h1>Hello World from Preact! 📦 🚀</h1>
        <Keyboard />
      </div>
    )
  }
}
