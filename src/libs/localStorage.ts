import { Bar, Beat, Sheet } from "pages/WhiteBoardPage2";
import { jingoBellSheet } from "./placeholder";
import { inferChord } from "./helper";

const ls = window.localStorage
const SheetsSavingKey = 'whiteboardSave'

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type BeatSaving = Override<Beat, Partial<Pick<Beat, "chord">>>
type BarSaving = Override<Bar, { beats: BeatSaving[] }>
type SheetSaving = Override<Sheet, { bars: BarSaving[] }>


function serializeSheets(sheets: Sheet[]): SheetSaving[] {
    return sheets.map(sheet => ({
        ...sheet,
        bars: sheet.bars.map(bar => ({
            ...bar,
            beats: bar.beats.map(beat => ({
                duration: beat.duration,
                lyrics: beat.lyrics,
                chordDisplay: beat.chordDisplay,
            }))
        }))
    }))
}

function saveSheets(sheets: Sheet[]) {
    const serializedSheets = JSON.stringify(serializeSheets(sheets))
    // console.log(serializedSheets)
    ls.setItem(SheetsSavingKey, serializedSheets)
}

function loadSheets(): Sheet[] {
    const defaultSheets = [jingoBellSheet]
    const savingStr = ls.getItem(SheetsSavingKey)
    if (!savingStr) {
        return defaultSheets
    } else {
        try {
            let data: SheetSaving[] = JSON.parse(savingStr)
            data.forEach(sheet => {
                sheet.bars.forEach(bar => {
                    bar.beats.forEach(beat => {
                        beat.chord = inferChord(beat.chordDisplay).chord
                    })
                })
            })
            return data
        } catch (err) {
            console.error(err)
            return defaultSheets
        }
    }
}


export { saveSheets, loadSheets }