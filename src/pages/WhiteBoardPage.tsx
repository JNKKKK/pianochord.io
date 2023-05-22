import { Chord } from '../libs/chord'
import { chords as Chords, modesTable } from '../libs/db'
import { inferChord, sanitize, sum } from '../libs/helper'
import { KeyName, Keys, keyPossibleName, keySimpleList } from '../libs/key'
import { Component, Fragment } from 'preact'
import { PlusCircle } from '../components/icon/PlusCircle'
import Modal from '../components/Modal'
import { signal } from "@preact/signals";
import KeySelector from '../components/KeySelector'
import { Plus } from '../components/icon/Plus'
import { addNotification } from '../libs/notification'
import { loadActiveSheet, loadSheets, saveActiveSheet, saveSheets } from '../libs/localStorage'
import { FilePlus } from '../components/icon/FilePlus'
import { Folder } from '../components/icon/Folder'
import { HelpCircle } from '../components/icon/HelpCircle'
import { Edit3 } from '../components/icon/Edit-3'
import { Trash2 } from '../components/icon/Trash-2'

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
    bars: Bar[],
    lastEdit: string,
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
const newSheetModal = signal({
    show: false,
    text: "",
})
const openSheetModal = signal({
    show: false,
})
const renameSheetModal = signal({
    show: false,
    text: "",
})


export default class WhiteBoardPage extends Component<WhiteBoardPageProps, WhiteBoardPageState> {

    constructor(props: WhiteBoardPageProps) {
        super(props)
        this.addBeatOnClick = this.addBeatOnClick.bind(this)
        this.addBeat = this.addBeat.bind(this)
        this.shouldDeleteBeat = this.shouldDeleteBeat.bind(this)
        this.newSheet = this.newSheet.bind(this)
        this.renameSheet = this.renameSheet.bind(this)
        this.saveSheets = this.saveSheets.bind(this)
        this.deleteSheet = this.deleteSheet.bind(this)

        const sheets = loadSheets()
        let activeSheet = loadActiveSheet()
        if (activeSheet >= sheets.length) activeSheet = 0

        this.state = {
            edit: true,
            learning: false,
            sheets,
            activeSheet,
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
        this.saveSheets()
        this.forceUpdate()
    }

    addBar() {
        if (this.state.sheets[this.state.activeSheet].bars.length > 60) {
            addNotification("You reached max number of bars.", 5000)
        } else {
            this.state.sheets[this.state.activeSheet].bars.push({ totalBeats: 4, beats: [] })
            this.saveSheets()
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

    newSheet() {
        const emptySheet: Sheet = {
            title: newSheetModal.value.text,
            key: "C",
            mode: 0,
            bars: [
                {
                    totalBeats: 4,
                    beats: []
                }
            ],
            lastEdit: (new Date()).toString(),
        }
        this.state.sheets.push(emptySheet)
        const activeSheet = this.state.sheets.length - 1
        this.setState({ activeSheet }, () => {
            this.saveSheets()
        })
        newSheetModal.value = {
            show: false,
            text: ""
        }
    }

    renameSheet() {
        this.state.sheets[this.state.activeSheet].title = renameSheetModal.value.text
        this.setState({ ...this.state })
        this.saveSheets()
        renameSheetModal.value = {
            show: false,
            text: ""
        }
    }

    saveSheets() {
        this.state.sheets[this.state.activeSheet].lastEdit = (new Date()).toString()
        saveSheets(this.state.sheets)
        saveActiveSheet(this.state.activeSheet)
    }

    deleteSheet(i: number) {
        if (this.state.sheets.length === 1) {
            alert("You cannot delete the only whiteboard you have.")
            return
        }
        if (confirm(`Do you want to delete whiteboard "${this.state.sheets[i].title}"? You cannot recover the deleted whiteboard.`)) {
            this.state.sheets.splice(i, 1)
            let newActiveSheet = this.state.activeSheet
            if (newActiveSheet == i) {
                newActiveSheet = 0
                this.setState({ activeSheet: newActiveSheet }, () => {
                    this.saveSheets()
                })
            }
        }
    }

    render() {
        return <Fragment>
            <div className={"whiteboard-container"}>
                <div className={"menu-container"}>
                    <div onClick={() => { newSheetModal.value = { ...newSheetModal.value, show: true } }}>
                        <span>New</span>
                        <FilePlus size={18} />
                    </div>
                    /
                    <div onClick={() => { renameSheetModal.value = { ...renameSheetModal.value, show: true, text: this.state.sheets[this.state.activeSheet].title } }}>
                        <span>Rename</span>
                        <Edit3 size={18} />
                    </div>
                    /
                    <div onClick={() => { openSheetModal.value = { ...openSheetModal.value, show: true } }}>
                        <span>Open</span>
                        <Folder size={18} />
                    </div>
                    /
                    <div>
                        <span>Help</span>
                        <HelpCircle size={18} />
                    </div>
                </div>
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
                                                const original = beat.chordDisplay
                                                beat.chordDisplay = sanitize(div.innerHTML)
                                                div.innerHTML = original
                                                // infer the chord from the edited value 
                                                let inferred = inferChord(beat.chordDisplay)
                                                beat.chord = inferred.chord
                                                beat.chordDisplay = inferred.chordDisplay
                                                this.shouldDeleteBeat(barIndex, beatIndex)
                                                this.setState({ ...this.state }, () => {
                                                    this.saveSheets()
                                                })
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
                                                beat.lyrics = sanitize(div.innerHTML)
                                                this.shouldDeleteBeat(barIndex, beatIndex)
                                                this.setState({ ...this.state }, () => {
                                                    this.saveSheets()
                                                })
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
                            rootKeyModal.value = { show: false }
                            this.forceUpdate(() => {
                                this.saveSheets()
                            })
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
                                modeModal.value = { show: false }
                                this.forceUpdate(() => {
                                    this.saveSheets()
                                })
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
            <Modal show={newSheetModal.value.show} setShow={(show) => { newSheetModal.value = { ...newSheetModal.value, show } }}>
                <div className={"newSheet-modal"}>
                    <h1>New Whiteboard</h1>
                    <input type='text' placeholder='Name' maxLength={30} value={newSheetModal.value.text} onChange={(e) => { newSheetModal.value.text = (e.target as HTMLInputElement).value }} />
                    <div>
                        <button type='button' className={"color-5"} onClick={() => { newSheetModal.value = { ...newSheetModal.value, show: false } }}>Cancel</button>
                        <button type='button' className={"color-5 active"} onClick={() => { this.newSheet() }}>Create</button>
                    </div>
                </div>
            </Modal>
            <Modal show={renameSheetModal.value.show} setShow={(show) => { renameSheetModal.value = { ...renameSheetModal.value, show } }}>
                <div className={"renameSheet-modal"}>
                    <h1>Rename Whiteboard</h1>
                    <input type='text' placeholder='Name' maxLength={30} value={renameSheetModal.value.text} onChange={(e) => { renameSheetModal.value.text = (e.target as HTMLInputElement).value }} />
                    <div>
                        <button type='button' className={"color-5"} onClick={() => { renameSheetModal.value = { ...renameSheetModal.value, show: false } }}>Cancel</button>
                        <button type='button' className={"color-5 active"} onClick={() => { this.renameSheet() }}>Confirm</button>
                    </div>
                </div>
            </Modal>
            <Modal show={openSheetModal.value.show} setShow={(show) => { openSheetModal.value = { ...openSheetModal.value, show } }}>
                <div className={"openSheet-modal"}>
                    {this.state.sheets.map((sheet, i) => (
                        <div className={["sheet-item", "color-" + (keySimpleList.indexOf(sheet.key) + 1), i == this.state.activeSheet ? "active" : ""].join(" ")}
                            onClick={() => {
                                openSheetModal.value = { show: false }
                                this.setState({ activeSheet: i }, () => {
                                    this.saveSheets()
                                })
                            }}>
                            <div className={"info-container"}>
                                <div className={"title"}>
                                    <h1>{sheet.title}</h1>
                                    <h2><b>Last edited:</b> {new Date(sheet.lastEdit).toLocaleString()}</h2>
                                </div>
                                <div className={"key-container"}>
                                    <span className={"label"}>Key:</span>
                                    <span className={["key", "color-" + (keySimpleList.indexOf(sheet.key) + 1)].join(" ")}>{sheet.key}</span>
                                </div>
                            </div>
                            <div className={"action-container"}>
                                <Trash2 size={18} onClick={(e) => { this.deleteSheet(i); e.preventDefault(); e.stopPropagation() }} />
                            </div>
                        </div>
                    ))
                    }
                </div>
            </Modal>
        </Fragment>
    }

}

export { Bar, Beat, Sheet }