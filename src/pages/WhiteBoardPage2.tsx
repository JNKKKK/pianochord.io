import { Chord } from '../libs/chord'
import { chords as Chords, modesTable } from '../libs/db'
import { inferChord, searchForChord, sum } from '../libs/helper'
import { KeyName, Keys, keyPossibleName, keySimpleList } from '../libs/key'
import { h, Component, Fragment } from 'preact'
import { PlusCircle } from '../components/icon/PlusCircle'
import DOMPurify from 'dompurify';
import { jingoBellSheet } from '../libs/placeholder'
import Modal from '../components/Modal'
import { signal } from "@preact/signals";
import KeySelector from '../components/KeySelector'
import { Plus } from '../components/icon/Plus'
import { addNotification, notifications } from '../libs/notification'

type Beat = {
    chord: Chord | null | String,
    duration: number,
    lyrics: string,
    chordDisplay: string
}
type Bar = {
    totalBeats: number,
    beats: Beat[]
}
type Sheet = {
    title: string
    key: KeyName,
    mode: number,
    bars: Bar[]
}
type WhiteBoardPageProps = {
}
type WhiteBoardPageState = {
    edit: boolean,
    sheet: Sheet
}


const rootKeyModal = signal({
    show: false
});
const modeModal = signal({
    show: false
})
const addBeatModal = signal({
    show: false,
    barIndex: 0,
    beatIndex: 0,
    activeRome: 0,
})

export default class WhiteBoardPage extends Component<WhiteBoardPageProps, WhiteBoardPageState> {

    constructor(props: WhiteBoardPageProps) {
        super(props)
        this.addBeatOnClick = this.addBeatOnClick.bind(this)
        this.addBeat = this.addBeat.bind(this)

        this.state = {
            edit: true,
            sheet: {
                ...jingoBellSheet
            }
        }

    }

    addBeatOnClick(barIndex: number, beatIndex: number) {
        return () => {
            if (this.state.sheet.bars[barIndex].beats.length < 6) {
                addBeatModal.value = { ...addBeatModal.value, show: true, barIndex, beatIndex }
            } else {
                addNotification("You reached max number of chords in one bar.", 5000)
            }
        }
    }

    addBeat(chord: Chord | null | String, chordDisplay: string, lyrics: string) {
        addBeatModal.value = { ...addBeatModal.value, show: false }
        let beats = this.state.sheet.bars[addBeatModal.value.barIndex].beats
        beats.splice(addBeatModal.value.beatIndex, 0, { chord, duration: 0, lyrics, chordDisplay })
        this.forceUpdate()
    }

    addBar() {
        this.state.sheet.bars.push({ totalBeats: 4, beats: [] })
        this.forceUpdate()
    }

    render() {
        return <Fragment>
            <div className={"whiteboard-container"}>
                <div className={"title-container"}>
                    <h1>{this.state.sheet.title}</h1>
                </div>
                <div className={"info-container"}>
                    <div className={"key-container"} onClick={() => { rootKeyModal.value = { show: true } }}>
                        <span className={"label"}>Key: </span>
                        <span className={["key", "color-" + (keySimpleList.indexOf(this.state.sheet.key) + 1)].join(" ")}>{this.state.sheet.key}</span>
                    </div>
                    <div className={"mode-container"} onClick={() => { modeModal.value = { show: true } }}>
                        <span className={"label"}>Mode: </span>
                        <span className={["mode", "color-" + (this.state.sheet.mode + 1)].join(" ")}>{modesTable[this.state.sheet.mode].name}</span>
                    </div>
                </div>
                <div className={"sheet-container"}> {
                    this.state.sheet.bars.map((bar, barIndex) =>
                        <div className={"bar"}>
                            {this.state.edit && <PlusCircle size={18} onClick={this.addBeatOnClick(barIndex, 0)} />}
                            {bar.beats.map((beat, beatIndex) =>
                                <Fragment>
                                    <div className={["beat", this.state.edit ? "edit" : "", "b-" + beat.duration].join(" ")}>
                                        <div className={["chordAbbrev", (beat.chordDisplay && (beat.chordDisplay === beat.chord)) ? "invalid" : ""].join(" ")} contentEditable={this.state.edit}
                                            onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                    (e.target as HTMLDivElement).blur()
                                                    e.preventDefault()
                                                    return false
                                                }
                                            }}
                                            onBlur={(e) => {
                                                let div = e.target as HTMLDivElement
                                                // fill the div with previous value
                                                // looks like we are discarding the edit
                                                let original = beat.chordDisplay
                                                beat.chordDisplay = DOMPurify.sanitize(div.innerHTML)
                                                div.innerHTML = original
                                                // infer the chord from the edited value 
                                                let inferred = inferChord(beat.chordDisplay)
                                                beat.chord = inferred.chord
                                                beat.chordDisplay = inferred.chordDisplay
                                                this.setState({ ...this.state })
                                            }} dangerouslySetInnerHTML={{ __html: beat.chordDisplay }} />
                                        <div className={"lyrics"} contentEditable={this.state.edit}
                                            onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                    (e.target as HTMLDivElement).blur()
                                                    e.preventDefault()
                                                    return false
                                                }
                                            }}>
                                            {beat.lyrics}
                                        </div>
                                    </div>
                                    {this.state.edit && <PlusCircle size={18} onClick={this.addBeatOnClick(barIndex, beatIndex + 1)} />}
                                </Fragment>
                            )
                            } </div>)
                }
                    {this.state.edit && <Plus size={18} onClick={() => { this.addBar() }} />}
                </div>
            </div >
            <Modal show={rootKeyModal.value.show} setShow={(show) => { rootKeyModal.value = { show } }}>
                <div className="rootKey-modal">
                    <KeySelector link={false} selectedKey={this.state.sheet.key}
                        setKey={(key) => {
                            this.setState({ sheet: { ...this.state.sheet, key } })
                            rootKeyModal.value = { show: false }
                        }}
                    />
                </div>
            </Modal>
            <Modal show={modeModal.value.show} setShow={(show) => { modeModal.value = { show } }}>
                <div className="mode-modal">
                    {modesTable.map((mode, i) => (
                        <div className={["mode-item", "color-" + (i + 1), i == this.state.sheet.mode ? "active" : ""].join(" ")}
                            onClick={() => { this.setState({ sheet: { ...this.state.sheet, mode: i } }); modeModal.value = { show: false } }}>
                            <h1>{mode.name}</h1>
                            <div className={"rome-container"}>
                                {mode.rome.map(rome => (<span>{rome}</span>))}
                            </div>
                        </div>
                    ))
                    }
                </div>
            </Modal>
            <Modal show={addBeatModal.value.show} setShow={(show) => { addBeatModal.value = { ...addBeatModal.value, show } }}>
                <div className="addBeat-modal">
                    <h1>Select a tonic:</h1>
                    <div className={"rome-container"}>
                        {modesTable[this.state.sheet.mode].rome.map((rome, i) =>
                            <span className={[i == addBeatModal.value.activeRome ? "active" : ""].join(" ")}
                                onClick={() => { addBeatModal.value = { ...addBeatModal.value, activeRome: i } }}>{rome}</span>
                        )}
                    </div>
                    <h1>Select a chord:</h1>
                    <div className={"chord-container"}>
                        {(() => {
                            let interval = sum(modesTable[this.state.sheet.mode].intervals.slice(0, addBeatModal.value.activeRome))
                            let keyNum = Keys[this.state.sheet.key] + interval
                            while (keyNum >= keyPossibleName.length) keyNum -= keyPossibleName.length
                            let key = keyPossibleName[keyNum][0]
                            let chords = Chords[key].filter((_, i) => modesTable[this.state.sheet.mode].chordIndex[addBeatModal.value.activeRome].includes(i))
                            return chords.map(chord =>
                                <span className={["color-" + (keySimpleList.indexOf(key) + 1)].join(" ")} onClick={() => { this.addBeat(chord, chord.shortName, "[lyrics]") }}>{chord.shortName}</span>
                            )
                        })()
                        }
                    </div>
                    <h2>Can't find the one you want? <a onClick={() => { this.addBeat(null, "", "[lyrics]") }}>Insert an empty chord</a> and you and always edit it later.</h2>
                </div>
            </Modal>
        </Fragment>
    }

}

export { Bar, Beat, Sheet }