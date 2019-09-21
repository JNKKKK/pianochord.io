import { h, Component } from 'preact'
import { urlEncodeKey } from '../libs/helper'

var keySelectorList = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

export default class KeySelector extends Component {
  render ({ selectedKey }) {
    return (
      <div className='keySelector-container'>
        {keySelectorList.map((key, i) => (
          <a href={'/chord/' + urlEncodeKey(key) + '/'} className={'keySelector-button color-' + (i + 1) + (selectedKey === key ? ' active' : '')}>
            {key}
          </a>
        ))}
      </div>
    )
  }
}

export { keySelectorList }
