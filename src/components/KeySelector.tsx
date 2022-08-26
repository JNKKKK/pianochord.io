import { h, Component } from 'preact'
import { urlEncodeKey } from '../libs/helper'
import { keySimpleList } from '../libs/key'

type KeySelectorProps = {
  selectedKey?: string
}

export default class KeySelector extends Component<KeySelectorProps> {
  render() {
    return (
      <div className='keySelector-container'>
        {keySimpleList.map((key, i) => (
          <a href={'/chord/' + urlEncodeKey(key) + '/'} className={'keySelector-button color-' + (i + 1) + (this.props.selectedKey === key ? ' active' : '')}>
            {key}
          </a>
        ))}
      </div>
    )
  }
}
