import { Chord } from '../libs/chord'
import { chords as Chords, modesTable } from '../libs/db'
import { inferChord, sum } from '../libs/helper'
import { KeyName, Keys, keyPossibleName, keySimpleList } from '../libs/key'
import { Component, Fragment } from 'preact'
import { PlusCircle } from '../components/icon/PlusCircle'
import DOMPurify from 'dompurify';
import Modal from '../components/Modal'
import { signal } from "@preact/signals";
import KeySelector from '../components/KeySelector'
import { Plus } from '../components/icon/Plus'
import { addNotification } from '../libs/notification'
import { loadSheets, saveSheets } from '../libs/localStorage'

type Beat = {
    chord?: Chord | String,
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
    learning: boolean,
    sheets: Sheet[],
    activeSheet: number,
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
        this.shouldDeleteBeat = this.shouldDeleteBeat.bind(this)

        this.state = {
            edit: true,
            learning: false,
            sheets: loadSheets(),
            activeSheet: 0,

        }

    }

    addBeatOnClick(barIndex: number, beatIndex: number) {
        return () => {
            if (this.state.sheets[this.state.activeSheet].bars[barIndex].beats.length < 6) {
                addBeatModal.value = { ...addBeatModal.value, show: true, barIndex, beatIndex }
            } else {
                addNotification("You reached max number of chords in one bar.", 5000)
            }
        }
    }

    addBeat(chord: Chord | String | undefined, chordDisplay: string, lyrics: string) {
        addBeatModal.value = { ...addBeatModal.value, show: false }
        let beats = this.state.sheets[this.state.activeSheet].bars[addBeatModal.value.barIndex].beats
        beats.splice(addBeatModal.value.beatIndex, 0, { chord, duration: 0, lyrics, chordDisplay })
        saveSheets(this.state.sheets)
        this.forceUpdate()
    }

    addBar() {
        if (this.state.sheets[this.state.activeSheet].bars.length > 60) {
            addNotification("You reached max number of bars.", 5000)
        } else {
            this.state.sheets[this.state.activeSheet].bars.push({ totalBeats: 4, beats: [] })
            saveSheets(this.state.sheets)
            this.forceUpdate()
        }
    }

    shouldDeleteBeat(barIndex: number, beatIndex: number) {
        let beat = this.state.sheets[this.state.activeSheet].bars[barIndex].beats[beatIndex]
        if (beat.lyrics === "" && beat.chordDisplay === "") {
            this.state.sheets[this.state.activeSheet].bars[barIndex].beats.splice(beatIndex, 1)
            if (this.state.sheets[this.state.activeSheet].bars[barIndex].beats.length == 0) {
                this.state.sheets[this.state.activeSheet].bars.splice(barIndex, 1)
            }
        }
    }

    render() {
        return <Fragment>
            <div className={"whiteboard-container"}>
                <div className={"title-container"}>
                    <h1>{this.state.sheets[this.state.activeSheet].title}</h1>
                </div>
                <div className={"control-bar"}>
                    <div className={"info-container"}>
                        <div className={"key-container"} onClick={() => { rootKeyModal.value = { show: true } }}>
                            <span className={"label"}>Key: </span>
                            <span className={["key", "color-" + (keySimpleList.indexOf(this.state.sheets[this.state.activeSheet].key) + 1)].join(" ")}>{this.state.sheets[this.state.activeSheet].key}</span>
                        </div>
                        <div className={"mode-container"} onClick={() => { modeModal.value = { show: true } }}>
                            <span className={"label"}>Mode: </span>
                            <span className={["mode", "color-" + (this.state.sheets[this.state.activeSheet].mode + 1)].join(" ")}>{modesTable[this.state.sheets[this.state.activeSheet].mode].name}</span>
                        </div>
                    </div>
                    <div className={"toggle-container"}>
                        <div className={"toggle"}>
                            <span>Edit Mode</span>
                            <div class="mt-io-garden">
                                <input id="edit-mode-checkbox" type="checkbox" checked={this.state.edit}
                                    onChange={(e) => {
                                        const div = e.target as HTMLInputElement
                                        this.setState({ edit: div.checked })
                                    }} />
                                <label for="edit-mode-checkbox"></label>
                            </div>
                        </div>
                        <div className={"toggle"}>
                            <span>Learning Mode</span>
                            <div class="mt-io-garden">
                                <input id="learning-mode-checkbox" type="checkbox" checked={this.state.learning}
                                    onChange={(e) => {
                                        const div = e.target as HTMLInputElement
                                        this.setState({ learning: div.checked })
                                    }} />
                                <label for="learning-mode-checkbox"></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"sheet-container"}> {
                    this.state.sheets[this.state.activeSheet].bars.map((bar, barIndex) =>
                        <div className={["bar", this.state.edit ? "edit" : ""].join(" ")}>
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
                                                const div = e.target as HTMLDivElement
                                                // fill the div with previous value
                                                // looks like we are discarding the edit
                                                let original = beat.chordDisplay
                                                beat.chordDisplay = DOMPurify.sanitize(div.innerHTML)
                                                div.innerHTML = original
                                                // infer the chord from the edited value 
                                                let inferred = inferChord(beat.chordDisplay)
                                                beat.chord = inferred.chord
                                                beat.chordDisplay = inferred.chordDisplay
                                                this.shouldDeleteBeat(barIndex, beatIndex)
                                                saveSheets(this.state.sheets)
                                                this.setState({ ...this.state })
                                            }} dangerouslySetInnerHTML={{ __html: beat.chordDisplay }} />
                                        <div className={"lyrics"} contentEditable={this.state.edit}
                                            onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                    (e.target as HTMLDivElement).blur()
                                                    e.preventDefault()
                                                    return false
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const div = e.target as HTMLDivElement
                                                beat.lyrics = DOMPurify.sanitize(div.innerHTML)
                                                this.shouldDeleteBeat(barIndex, beatIndex)
                                                saveSheets(this.state.sheets)
                                                this.setState({ ...this.state })
                                            }} dangerouslySetInnerHTML={{ __html: beat.lyrics }}>
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
                    <KeySelector link={false} selectedKey={this.state.sheets[this.state.activeSheet].key}
                        setKey={(key) => {
                            this.state.sheets[this.state.activeSheet].key = key
                            saveSheets(this.state.sheets)
                            rootKeyModal.value = { show: false }
                            this.forceUpdate()
                        }}
                    />
                </div>
            </Modal>
            <Modal show={modeModal.value.show} setShow={(show) => { modeModal.value = { show } }}>
                <div className="mode-modal">
                    {modesTable.map((mode, i) => (
                        <div className={["mode-item", "color-" + (i + 1), i == this.state.sheets[this.state.activeSheet].mode ? "active" : ""].join(" ")}
                            onClick={() => {
                                this.state.sheets[this.state.activeSheet].mode = i
                                saveSheets(this.state.sheets)
                                modeModal.value = { show: false }
                                this.forceUpdate()
                            }}>
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
                        {modesTable[this.state.sheets[this.state.activeSheet].mode].rome.map((rome, i) =>
                            <span className={[i == addBeatModal.value.activeRome ? "active" : ""].join(" ")}
                                onClick={() => { addBeatModal.value = { ...addBeatModal.value, activeRome: i } }}>{rome}</span>
                        )}
                    </div>
                    <h1>Select a chord:</h1>
                    <div className={"chord-container"}>
                        {(() => {
                            let interval = sum(modesTable[this.state.sheets[this.state.activeSheet].mode].intervals.slice(0, addBeatModal.value.activeRome))
                            let keyNum = Keys[this.state.sheets[this.state.activeSheet].key] + interval
                            while (keyNum >= keyPossibleName.length) keyNum -= keyPossibleName.length
                            let key = keyPossibleName[keyNum][0]
                            let chords = Chords[key].filter((_, i) => modesTable[this.state.sheets[this.state.activeSheet].mode].chordIndex[addBeatModal.value.activeRome].includes(i))
                            return chords.map(chord =>
                                <span className={["color-" + (keySimpleList.indexOf(key) + 1)].join(" ")} onClick={() => { this.addBeat(chord, chord.shortName, "[lyrics]") }}>{chord.shortName}</span>
                            )
                        })()
                        }
                    </div>
                    <h2>Can't find the one you want? <a onClick={() => { this.addBeat(undefined, "", "[lyrics]") }}>Insert an empty chord</a> and you and always edit it later.</h2>
                </div>
            </Modal>
        </Fragment>
    }

}

export { Bar, Beat, Sheet }