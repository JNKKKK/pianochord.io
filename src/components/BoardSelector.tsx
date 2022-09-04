import { Board } from 'pages/WhiteBoardPage'
import { h, Component } from 'preact'

type BoardSelectorProps = {
    boards: Board[],
    selectedBoard: number,
    handleSelect: (i: number) => void,
    handleRename: (i: number, name: string) => void,
}

type BoardSelectorState = {
}



export default class BoardSelector extends Component<BoardSelectorProps, BoardSelectorState> {
    constructor(props: BoardSelectorProps) {
        super(props)
    }

    render() {
        return (
            <div className='boardSelector-container'>
                <span></span>
            </div>
        )
    }

}