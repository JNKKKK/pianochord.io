import { h, Component } from 'preact'
import { urlEncodeKey } from '../libs/helper'
import { KeyName, keySimpleList } from '../libs/key'

type KeySelectorProps = {
  selectedKey?: string
  link: boolean
  setKey?: (key: KeyName) => void
}

export default class KeySelector extends Component<KeySelectorProps> {
  render() {
    return (
      <div className='keySelector-container'>
        {this.props.link === true && keySimpleList.map((key, i) => (
          <a href={'/chord/' + urlEncodeKey(key) + '/'} className={'keySelector-button color-' + (i + 1) + (this.props.selectedKey === key ? ' active' : '')}>
            {key}
          </a>
        ))}
        {this.props.link === false && keySimpleList.map((key, i) => (
          <div onClick={() => { if (this.props.setKey) this.props.setKey(key) }} className={'keySelector-button color-' + (i + 1) + (this.props.selectedKey === key ? ' active' : '')}>
            {key}
          </div>
        ))}
      </div>
    )
  }
}
