import { Chord } from 'libs/chord'
import { h, Component, Fragment } from 'preact'
import { loadBoard } from '../libs/localStorage'
import { Edit3 } from '../components/icon/Edit-3'
import { FilePlus } from '../components/icon/FilePlus'
import { Trash2 } from '../components/icon/Trash-2'
import { RefreshCw } from '../components/icon/Refresh-cw'
import { Share2 } from '../components/icon/Share-2'
import ChordThumbnail from '../components/ChordThumbnail'
import { Key, keySimpleList } from '../libs/key'

type Card = {
    chord: Chord,
    name: string
}

type Board = {
    cards: Card[],
    name: string
}

type WhiteBoardPageProps = {
}
type WhiteBoardPageState = {
    boards: Board[],
    selectedBoard: number,
}


export default class WhiteBoardPage extends Component<WhiteBoardPageProps, WhiteBoardPageState> {
    constructor(props: WhiteBoardPageProps) {
        super(props)
        this.state = loadBoard()
    }

    render() {
        console.log(this.state)
        return (
            <Fragment>
                <div className='whiteboard-container'>
                    <div className='title-container'>
                        <h1>{this.state.boards[this.state.selectedBoard].name}</h1>
                        <div className="menu-container">
                            <button><Edit3 size={15} />Rename</button>
                            <button><FilePlus size={15} />New</button>
                            <button><Trash2 size={15} />Delete</button>
                            <button><RefreshCw size={15} />Switch</button>
                            <button><Share2 size={15} />Share</button>
                        </div>
                    </div>
                    <div className='cards-container'>
                        {
                            this.state.boards[this.state.selectedBoard].cards.map(card => (
                                <div className='card'>
                                    <ChordThumbnail chord={card.chord} highlightColor={keySimpleList.map(str => Key[str]).indexOf(card.chord.key) + 1} />
                                    <div className='name'>{card.name}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export type { Board, Card }