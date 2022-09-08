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
import { Plus } from "../components/icon/Plus";
import Modal from "../components/Modal";
import { Clipboard } from "../components/icon/Clipboard";

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
    renameModal: {
        show: boolean,
        text: string,
    },
    newBoardModal: {
        show: boolean,
        text: string,
    }
    switchBoardModal: {
        show: boolean,
    }
}


export default class WhiteBoardPage extends Component<WhiteBoardPageProps, WhiteBoardPageState> {

    constructor(props: WhiteBoardPageProps) {
        super(props)
        this.state = {
            ...loadBoard(),
            draggingId: -1,
            renameModal: { show: false, text: "" },
            newBoardModal: { show: false, text: "" },
            switchBoardModal: { show: false },
        }
    }

    componentDidMount() {
        polyfill()
        window.addEventListener('touchmove', function () { }, { passive: false });
    }

    render() {
        return (
            <Fragment>
                <div className='whiteboard-container'>
                    <div className='title-container'>
                        <h1>{this.state.boards[this.state.selectedBoard].name}</h1>
                        <div className="menu-container">
                            <button onClick={() => { this.setState({ renameModal: { ...this.state.renameModal, show: true } }) }}><Edit3 size={15} />Rename</button>
                            <button onClick={() => { this.setState({ newBoardModal: { ...this.state.newBoardModal, show: true } }) }}><FilePlus size={15} />New</button>
                            <button
                                disabled={this.state.boards.length > 1 ? false : true}
                                onClick={() => {
                                    if (this.state.boards.length > 1 && confirm(`Do you want to delete board ${this.state.boards[this.state.selectedBoard].name} ?`)) {
                                        this.state.boards.splice(this.state.selectedBoard, 1)
                                        this.setState({ selectedBoard: 0 })
                                    }
                                }}
                            >
                                <Trash2 size={15} />Delete
                            </button>
                            <button onClick={() => { this.setState({ switchBoardModal: { ...this.state.switchBoardModal, show: true } }) }}><RefreshCw size={15} />Switch</button>
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
                                        <Trash2 className="delete" size={20} onClick={(e) => {
                                            let cards = this.state.boards[this.state.selectedBoard].cards
                                            cards.splice(i, 1)
                                            saveBoard({ boards: this.state.boards, selectedBoard: this.state.selectedBoard })
                                            this.setState({ boards: this.state.boards })
                                        }} />
                                    </div>
                                    <ChordThumbnail chord={card.chord} highlightColor={keySimpleList.map(str => Key[str]).indexOf(card.chord.key) + 1} />
                                    <div className='name'>{card.name}</div>
                                </div>
                            ))
                        }
                        <div className='card add-card'>
                            <Plus size={45} />
                        </div>
                    </div>
                </div>
                <Modal show={this.state.renameModal.show} setShow={(show) => this.setState({ renameModal: { ...this.state.renameModal, show } })}>
                    <div className="rename-modal">
                        <h1>{`Rename board "${this.state.boards[this.state.selectedBoard].name}" to`}</h1>
                        <input maxLength={20} onInput={(e) => { this.setState({ renameModal: { ...this.state.renameModal, text: e.currentTarget.value } }) }}></input>
                        <div className="actions-container">
                            <button className="highlighted" onClick={() => {
                                if (!this.state.renameModal.text) {
                                    alert("Name cannot be empty!")
                                    return
                                }
                                this.state.boards[this.state.selectedBoard].name = this.state.renameModal.text
                                saveBoard({ boards: this.state.boards, selectedBoard: this.state.selectedBoard })
                                this.setState({ renameModal: { ...this.state.renameModal, show: false } })
                            }}>Save</button>
                            <button onClick={() => { this.setState({ renameModal: { ...this.state.renameModal, show: false } }) }}>Cancel</button>
                        </div>
                    </div>
                </Modal>
                <Modal show={this.state.newBoardModal.show} setShow={(show) => this.setState({ newBoardModal: { ...this.state.newBoardModal, show } })}>
                    <div className="newBoard-modal">
                        <h1>Create a new whiteboard</h1>
                        <input maxLength={20} placeholder="Name" onInput={(e) => { this.setState({ newBoardModal: { ...this.state.newBoardModal, text: e.currentTarget.value } }) }}></input>
                        <div className="actions-container">
                            <button className="highlighted" onClick={() => {
                                if (!this.state.newBoardModal.text) {
                                    alert("Name cannot be empty!")
                                    return
                                }
                                let newBoard: Board = { cards: [], name: this.state.newBoardModal.text }
                                let i = this.state.boards.push(newBoard) - 1
                                saveBoard({ boards: this.state.boards, selectedBoard: i })
                                this.setState({ newBoardModal: { ...this.state.newBoardModal, show: false }, selectedBoard: i })
                            }}>Create</button>
                            <button onClick={() => { this.setState({ newBoardModal: { ...this.state.newBoardModal, show: false } }) }}>Cancel</button>
                        </div>
                    </div>
                </Modal>
                <Modal show={this.state.switchBoardModal.show} setShow={(show) => this.setState({ switchBoardModal: { ...this.state.switchBoardModal, show } })}>
                    <div className="switchBoard-modal">
                        <h1>My Whiteboards</h1>
                        {
                            this.state.boards.map((board, i) => (
                                <div className="item-container" onClick={(e) => {
                                    saveBoard({ boards: this.state.boards, selectedBoard: i })
                                    this.setState({ selectedBoard: i, switchBoardModal: { ...this.state.switchBoardModal, show: false } })
                                }}>
                                    <Clipboard className="icon" size={25} />
                                    <span>{board.name}</span>
                                    {this.state.boards.length > 1 && <Trash2 className="delete" size={25} onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.state.boards.splice(i, 1)
                                        saveBoard({ boards: this.state.boards, selectedBoard: 0 })
                                        this.setState({ selectedBoard: 0 })
                                    }} />}
                                </div>
                            ))
                        }
                    </div>
                </Modal>
            </Fragment >
        )
    }
}

export type { Board, Card }