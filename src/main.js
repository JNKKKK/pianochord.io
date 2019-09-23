import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { h, render } from 'preact'
import App from './App'

const mountNode = document.getElementById('app')
render(<App />, mountNode, mountNode.lastChild)
