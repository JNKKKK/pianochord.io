import { Chord } from 'libs/chord'
import { h, Component } from 'preact'
import { getHighlightTable } from '../libs/helper'
import { bw, bwMap } from '../libs/key'

const whiteWidth = 9
const whiteHeight = 40
const blackWidth = 4.5
const blackHeight = 25

let blackOccurIndex = [1, 3, 6, 8, 10]
blackOccurIndex = [...blackOccurIndex, ...blackOccurIndex.map(i => i + bwMap.length), ...blackOccurIndex.map(i => i + bwMap.length * 2)]
let whiteOccurIndex = [0, 2, 4, 5, 7, 9, 11]
whiteOccurIndex = [...whiteOccurIndex, ...whiteOccurIndex.map(i => i + bwMap.length), ...whiteOccurIndex.map(i => i + bwMap.length * 2)]
let bwMap3x = [...bwMap, ...bwMap, ...bwMap]

function whiteIfActive(i: number, highlightTable: boolean[]) {
  return highlightTable[whiteOccurIndex[i]]
}

function blackIfActive(i: number, highlightTable: boolean[]) {
  return highlightTable[blackOccurIndex[i]]
}

type ChordThumbnailProps = {
  chord: Chord,
  highlightColor: number
}

export default class ChordThumbnail extends Component<ChordThumbnailProps> {
  render() {
    let highlightTable = getHighlightTable(this.props.chord)
    let octaves = highlightTable.length / 12
    return (
      <svg className='ChordThumbnail-svg' width={whiteWidth * 7 * octaves} height={whiteHeight}>
        {[...Array(7 * octaves).keys()].map(i => (
          <rect className={'white' + (whiteIfActive(i, highlightTable) ? ' active color-' + this.props.highlightColor : '')}
            width={whiteWidth} height={whiteHeight} x={whiteWidth * i} />
        ))}
        {[...Array(5 * octaves).keys()].map(i => (
          <rect className={'black' + (blackIfActive(i, highlightTable) ? ' active color-' + this.props.highlightColor : '')}
            width={blackWidth} height={blackHeight}
            x={whiteWidth * (bwMap3x.slice(0, blackOccurIndex[i]).filter(x => x === bw.white).length) - blackWidth / 2} />
        ))}
      </svg>
    )
  }
}
