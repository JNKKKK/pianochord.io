import { Chord } from 'libs/chord'
import { chromaticName, Key, keySimpleList } from '../libs/key'
import { h, Component, Fragment } from 'preact'
import { intervalTable, inversionNames } from '../libs/db'
import ChordThumbnail from './ChordThumbnail'
import { ChevronRight } from './icon/ChevronRight'
import { route } from 'preact-router'
import { ChevronDown } from './icon/ChevronDown'
import { Plus } from './icon/Plus'
import { loadBoard, saveBoard } from '../libs/localStorage'
import { Card } from 'pages/WhiteBoardPage'

type ChordDetailProps = {
  chord: Chord,
  inversion: number,
  addNotification: (text: string, duration: number) => void
}

type ChordDetailState = {
  inversionOpen: boolean
}

export default class ChordDetail extends Component<ChordDetailProps, ChordDetailState> {
  constructor(props: ChordDetailProps) {
    super(props)
    this.state = { inversionOpen: false }
    this.handleInversionClick = this.handleInversionClick.bind(this)
    this.addToWhiteboard = this.addToWhiteboard.bind(this)
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

  addToWhiteboard() {
    let boardSaving = loadBoard()
    let card: Card
    if (this.props.inversion === 0) {
      card = { chord: this.props.chord, name: this.props.chord.alias[0] }
    } else {
      card = { chord: this.props.chord.inversions[this.props.inversion - 1], name: this.props.chord.inversions[this.props.inversion - 1].alias[0] }
    }
    boardSaving.boards[boardSaving.selectedBoard].cards.push(card)
    saveBoard(boardSaving)
    this.props.addNotification(`Added ${this.props.chord.alias[0]} to ${boardSaving.boards[boardSaving.selectedBoard].name}`, 2000)
  }

  render() {
    let chord = this.props.chord
    return (
      <Fragment>
        <div className='chordDetail-container'>
          <div className='action-container'>
            <button onClick={this.addToWhiteboard}><Plus size={15} />Add to whiteboard</button>
          </div>
          <div className='information-container'>
            <h1>
              {this.props.inversion === 0 ? chord.name : chord.inversions[this.props.inversion - 1].alias[0]}
            </h1>
            {
              this.props.inversion === 0 && (
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
              )
            }
            {
              this.props.inversion > 0 && (
                <div className='information'>

                  <div><b>Inversion</b> {inversionNames[this.props.inversion]}</div>
                  <div><b>Root Position Chord Name</b> {(chord.fullName) ? chord.fullName : chord.alias[0]}</div>
                  {chord.alias.length > 1 &&
                    <div>
                      <b>Alias</b>
                      {chord.inversions[this.props.inversion - 1].alias.slice(1).join(', ')}
                    </div>
                  }
                </div>
              )
            }
          </div>
          {chord.inversions.length > 0 &&
            <div className='inversion-container'>
              <div className={'inversion-header' + (this.state.inversionOpen ? ' open' : '')} onClick={() => this.setState({ inversionOpen: !this.state.inversionOpen })}>
                <span>Inversions</span>
                {this.state.inversionOpen ? <ChevronDown size={21} /> : <ChevronRight size={21} />}
              </div>
              {this.state.inversionOpen &&
                <div className='inversion-content'>
                  {[chord, ...chord.inversions].map((c, i) => {
                    let colorIndex = keySimpleList.map(str => Key[str]).indexOf(c.key) + 1
                    let inversion = this.props.inversion
                    return (
                      <div className={'chord color-' + colorIndex + (inversion == i ? ' active' : '')} onClick={this.handleInversionClick(i)}>
                        <div className='chord-title'>{inversionNames[i]}</div>
                        <ChordThumbnail chord={c} highlightColor={colorIndex} />
                        <div className='chord-name'>{`${c.alias[0]}`}</div>
                      </div>
                    )
                  })}
                </div>
              }
            </div>
          }
        </div>
      </Fragment>
    )
  }
}
