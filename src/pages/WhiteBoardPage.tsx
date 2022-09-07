import { polyfill } from "mobile-drag-drop";
import { Chord } from 'libs/chord'
import { h, Component, Fragment, createRef, RefObject } from 'preact'
import { loadBoard, saveBoard } from '../libs/localStorage'
import { Edit3 } from '../components/icon/Edit-3'
import { FilePlus } from '../components/icon/FilePlus'
import { Trash2 } from '../components/icon/Trash-2'
import { RefreshCw } from '../components/icon/Refresh-cw'
import { Share2 } from '../components/icon/Share-2'
import ChordThumbnail from '../components/ChordThumbnail'
import { Key, keySimpleList } from '../libs/key'
import { Move } from '../components/icon/Move'

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
    draggingId: number,
}


export default class WhiteBoardPage extends Component<WhiteBoardPageProps, WhiteBoardPageState> {

    constructor(props: WhiteBoardPageProps) {
        super(props)
        this.state = { ...loadBoard(), draggingId: -1 }
    }

    componentDidMount() {
        console.log(polyfill())
        window.addEventListener("touchmove", function () { });
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
                            this.state.boards[this.state.selectedBoard].cards.map((card, i) => (
                                <div className='card'
                                    onDragEnd={(e) => {
                                        e.currentTarget.setAttribute("draggable", "false")
                                    }}
                                    onDragStart={(e) => { this.setState({ draggingId: i }) }}
                                    onDragEnter={(e) => {
                                        if (this.state.draggingId != i && this.state.draggingId != -1) {
                                            let cards = this.state.boards[this.state.selectedBoard].cards
                                            let deletedCard = cards.splice(this.state.draggingId, 1)
                                            cards.splice(i, 0, deletedCard[0])
                                            saveBoard({ boards: this.state.boards, selectedBoard: this.state.selectedBoard })
                                            this.setState({ boards: this.state.boards, draggingId: i })
                                        }
                                        e.preventDefault();
                                    }}
                                    onDragOver={(e) => { e.preventDefault(); }}
                                    onDragLeave={(e) => { e.preventDefault(); }}
                                >
                                    <div className='actions-container'>
                                        <Move className='drag' size={20}
                                            onMouseDown={(e) => { e.currentTarget.parentElement?.parentElement?.setAttribute("draggable", "true") }}
                                            onMouseUp={(e) => { e.currentTarget.parentElement?.parentElement?.setAttribute("draggable", "false") }}
                                            onTouchStart={(e) => { e.currentTarget.parentElement?.parentElement?.setAttribute("draggable", "true") }}
                                            onTouchEnd={(e) => { e.currentTarget.parentElement?.parentElement?.setAttribute("draggable", "false") }}
                                        />
                                        <Trash2 className="delete" size={20} />
                                    </div>
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