import { h, Component } from 'preact'
import { urlEncodeKey } from '../libs/myhelper'
import { keySimpleList } from '../libs/key'


export default class KeySelector extends Component {
  render ({ selectedKey }) {
    return (
      <div className='keySelector-container'>
        {keySimpleList.map((key, i) => (
          <a href={'/chord/' + urlEncodeKey(key) + '/'} className={'keySelector-button color-' + (i + 1) + (selectedKey === key ? ' active' : '')}>
            {key}
          </a>
        ))}
      </div>
    )
  }
}
