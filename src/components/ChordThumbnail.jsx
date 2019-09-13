import { h, Component } from 'preact'

const whiteWidth = 10
const whiteHeight = 40
const blackWidth = 5
const blackHeight = 30
var bwMap = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white']
var blackOccurIndex = [1, 3, 6, 8, 10]
blackOccurIndex = blackOccurIndex.concat(blackOccurIndex.map(i => i + bwMap.length))
bwMap = bwMap.concat(bwMap)

export default class ChordThumbnail extends Component {
  render () {
    return (
      <svg className='ChordThumbnail-svg' width={whiteWidth * 14} height={whiteHeight}>
        {[...Array(14).keys()].map(i => (
          <rect className='white' width={whiteWidth} height={whiteHeight} x={whiteWidth * i} />
        ))}
        {[...Array(10).keys()].map(i => (
          <rect className='black' width={blackWidth} height={blackHeight}
            x={whiteWidth * (bwMap.slice(0, blackOccurIndex[i]).filter(bw => bw === 'white').length) - blackWidth / 2} />
        ))}
      </svg>
    )
  }
}
