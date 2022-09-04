import BoardSelector from '../components/BoardSelector'
import { Chord } from 'libs/chord'
import { h, Component, Fragment } from 'preact'
import { loadBoard } from '../libs/localStorage'

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
        return (
            <Fragment>
                <div className='whiteboard-container'>
                    <BoardSelector
                        boards={this.state.boards}
                        selectedBoard={this.state.selectedBoard}
                        handleSelect={i => this.setState({ selectedBoard: i })}
                        handleRename={(i, name) => {
                            this.state.boards[i].name = name
                        }}
                    />
                </div>
            </Fragment>
        )
    }
}

export type { Board, Card }