import { h, Component } from 'preact'
import { getHighlightTable, bwMap } from '../libs/myhelper'

const whiteWidth = 9
const whiteHeight = 40
const blackWidth = 4.5
const blackHeight = 25
let blackOccurIndex = [1, 3, 6, 8, 10]
blackOccurIndex = blackOccurIndex.concat(blackOccurIndex.map(i => i + bwMap.length)).concat(blackOccurIndex.map(i => i + bwMap.length * 2))
let whiteOccurIndex = [0, 2, 4, 5, 7, 9, 11]
whiteOccurIndex = whiteOccurIndex.concat(whiteOccurIndex.map(i => i + bwMap.length)).concat(whiteOccurIndex.map(i => i + bwMap.length * 2))
let bw = bwMap.concat(bwMap).concat(bwMap)

function whiteIfActive (i, highlightTable) {
  return highlightTable[whiteOccurIndex[i]]
}

function blackIfActive (i, highlightTable) {
  return highlightTable[blackOccurIndex[i]]
}

export default class ChordThumbnail extends Component {
  render ({ chord, highlightColor }) {
    let highlightTable = getHighlightTable(chord)

    return (
      <svg className='ChordThumbnail-svg' width={whiteWidth * 7 * 3} height={whiteHeight}>
        {[...Array(7 * 3).keys()].map(i => (
          <rect className={'white' + (whiteIfActive(i, highlightTable) ? ' active color-' + highlightColor : '')}
            width={whiteWidth} height={whiteHeight} x={whiteWidth * i} />
        ))}
        {[...Array(5 * 3).keys()].map(i => (
          <rect className={'black' + (blackIfActive(i, highlightTable) ? ' active color-' + highlightColor : '')}
            width={blackWidth} height={blackHeight}
            x={whiteWidth * (bw.slice(0, blackOccurIndex[i]).filter(bw => bw === 'white').length) - blackWidth / 2} />
        ))}
      </svg>
    )
  }
}
