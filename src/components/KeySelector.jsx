import { h, Component } from 'preact'

var keySelectorList = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

// C# -> C-sharp
function key2url (key) {
  key = key.replace('#', '-sharp')
  key = key.replace('b', '-flat')
  return key
}

export default class KeySelector extends Component {
  render ({ selected }) {
    return (
      <div className='keySelector-container'>
        {keySelectorList.map((key, i) => (
          <a href={'/' + key2url(key)} className={'keySelector-button color-' + (i + 1) + (selected === key ? ' active' : '')}>
            {key}
          </a>
        ))}
      </div>
    )
  }
}

export { keySelectorList }
