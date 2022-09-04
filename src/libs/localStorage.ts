import { Board, Card } from "pages/WhiteBoardPage"
import { Chord } from "./chord";

const ls = window.localStorage
const savingKey = 'saving'

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type BoardSavingUnserialized = {
    boards: Board[],
    selectedBoard: number,
}
type CardSerialized = Override<Card, { chord: string }>
type BoardSerialized = Override<Board, { cards: CardSerialized[] }>
type BoardSavingSerialized = Override<BoardSavingUnserialized, { boards: BoardSerialized[] }>

type SavingUnserialized = BoardSavingUnserialized
type SavingSerialized = BoardSavingSerialized

function serializeBoardSaving(data: BoardSavingUnserialized): BoardSavingSerialized {
    let boards = data.boards.map(board => {
        let cardsStr = board.cards.map(card => ({ ...card, chord: card.chord.toString() }))
        return {
            cards: cardsStr,
            name: board.name,
        }
    })
    return {
        boards,
        selectedBoard: data.selectedBoard
    }
}

function saveBoard(data: BoardSavingUnserialized) {
    let serializeData = serializeBoardSaving(data)
    ls.setItem(savingKey, JSON.stringify(serializeData))
}

function loadBoard(): BoardSavingUnserialized {
    let dataStr = ls.getItem(savingKey)
    if (!dataStr) {
        return { boards: [{ cards: [], name: 'Untitled 1' }], selectedBoard: 0 }
    } else {
        let data: BoardSavingSerialized = JSON.parse(dataStr)
        return {
            boards: data.boards.map(board => {
                return {
                    cards: board.cards.map(card => ({ ...card, chord: Chord.deserialize(card.chord) })),
                    name: board.name,
                }
            }),
            selectedBoard: data.selectedBoard
        }
    }
}

export { saveBoard, loadBoard }