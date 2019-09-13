import { h, Component } from 'preact'

import { chord } from '@tonaljs/chord'
import { entries } from '@tonaljs/chord-dictionary'
import ChordThumbnail from './ChordThumbnail'

// ChordData -> DisplayName
function getDisplayName (chord) {
  if (chord.name.length > 17) {
    return chord.tonic + chord.aliases[0]
  }
  if (chord.name === chord.tonic + ' ') {
    return chord.name.slice(0, -1) + chord.aliases[0]
  } else {
    return chord.name
  }
}

export default class ChordSelector extends Component {
  render ({ selectedKey }) {
    var chordTypes = entries()
    var chordDatas = chordTypes.map(ct => {
      let displayName
      if (ct.name) {
        displayName = ct.name
      } else {
        displayName = ct.aliases[0]
      }
      return chord(selectedKey + ' ' + displayName)
    })

    console.log(chordDatas)
    return (
      <div className='chordSelector-container'>
        {chordDatas.map(c => (
          <div className='chordSelector-chord'>
            <ChordThumbnail />
            <div className='chordSelector-chord-name'>{getDisplayName(c)}</div>
          </div>
        ))}

      </div>
    )
  }
}
