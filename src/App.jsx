import { Fragment, h, Component } from 'preact'
import Keyboard from './components/Keyboard'
import KeySelector, { keySelectorList } from './components/KeySelector'

// import Router from 'preact-router'
import Match from 'preact-router/match'

import './scss/App.scss'

// /C-flat/.. -> Cb
function url2key (url) {
  url = url.split('/')
  if (url.length < 2) {
    return ''
  } else {
    var key = url[1]
    key = key.replace('-flat', 'b')
    key = key.replace('-sharp', '#')
    if (keySelectorList.includes(key)) {
      return key
    } else {
      return ''
    }
  }
}

export default class App extends Component {
  render () {
    return (
      <div>
        <Match path='/'>
          {({ matches, path, url }) => {
            var key = url2key(url)
            return (
              <Fragment>
                <Keyboard />
                <KeySelector selected={key} />
              </Fragment>
            )
          }}
        </Match>
      </div>
    )
  }
}
