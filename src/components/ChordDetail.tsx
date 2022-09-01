import { Chord } from 'libs/chord'
import { chromaticName, Key, keySimpleList } from '../libs/key'
import { h, Component } from 'preact'
import { intervalTable, inversionNames } from '../libs/db'
import ChordThumbnail from './ChordThumbnail'
import { ChevronRight } from './icon/ChevronRight'
import { route } from 'preact-router'

type ChordDetailProps = {
  chord: Chord,
  inversion: number,
}

type ChordDetailState = {
}

export default class ChordDetail extends Component<ChordDetailProps, ChordDetailState> {
  constructor(props: ChordDetailProps) {
    super(props)
    this.state = {}
    this.handleInversionClick = this.handleInversionClick.bind(this)
  }

  handleInversionClick(i: number) {
    return () => {
      let path = window.location.pathname.split('/')
      if (path.length == 4) {
        path.push(i.toString())
      } else if (path.length == 5) {
        path[4] = i.toString()
      }
      if (i == 0) path = path.slice(0, 4)
      route(path.join('/'), false);
      window.scrollTo(0, 0)
    }
  }

  render() {
    let chord = this.props.chord
    return (
      <div className='chordDetail-container'>
        <div className='information-container'>
          <h1>{chord.name}</h1>
          <div className='information'>
            <div><b>Tonic</b> {chord.tonic}</div>
            <div><b>Interval</b> {chord.intervals.map(i => intervalTable[i].abbrev).join(', ')}</div>
            {
              chord.quality &&
              <div><b>Quality</b> {chord.quality}</div>
            }
            {
              // if has fullname, display all alias
              (chord.fullName) &&
              <div><b>Aliases</b> {chord.alias.join(', ')}</div>
            }
            {
              // if no fullname, and has >1 alias, display the rest of alias
              (!chord.fullName && chord.alias.length > 1) &&
              <div><b>Aliases</b> {chord.alias.slice(1).join(', ')}</div>
            }
          </div>
        </div>
        {chord.inversions.length > 0 &&
          <div className='inversion-container'>
            <div className='inversion-header'>
              <span>Inversions</span>
              <ChevronRight size={21} />
            </div>
            <div className='inversion-content'>
              {[chord, ...chord.inversions].map((c, i) => {
                let colorIndex = keySimpleList.map(str => Key[str]).indexOf(c.key) + 1
                let inversion = this.props.inversion
                return (
                  <div className={'chord color-' + colorIndex + (inversion == i ? ' active' : '')} onClick={this.handleInversionClick(i)}>
                    <div className='chord-title'>{inversionNames[i]}</div>
                    <ChordThumbnail chord={c} highlightColor={colorIndex} />
                    {
                      (i == 0) ?
                        <div className='chord-name'>{`${chord.alias[0]}`}</div>
                        :
                        <div className='chord-name'>{`${chord.alias[0]}/${chromaticName[c.key]}`}</div>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
    )
  }
}
