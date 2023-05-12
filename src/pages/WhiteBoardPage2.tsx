import { Chord } from '../libs/chord'
import { chords } from '../libs/db'
import { inferChord, searchForChord } from '../libs/helper'
import { KeyName, Keys, keySimpleList } from '../libs/key'
import { h, Component, Fragment } from 'preact'
import { PlusCircle } from '../components/icon/PlusCircle'
import DOMPurify from 'dompurify';
import { jingoBellSheet } from '../libs/placeholder'

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
    bars: Bar[]
}
type WhiteBoardPageProps = {
}
type WhiteBoardPageState = {
    edit: boolean,
    key: KeyName,
    sheet: Sheet
}




export default class WhiteBoardPage extends Component<WhiteBoardPageProps, WhiteBoardPageState> {

    constructor(props: WhiteBoardPageProps) {
        super(props)
        // this.inferChord = this.inferChord.bind(this)

        this.state = {
            edit: true,
            key: "G",
            sheet: {
                ...jingoBellSheet
            }
        }
    }

    render() {
        return <div className={"whiteboard-container"}>
            <div className={"sheet-container"}> {
                this.state.sheet.bars.map((bar, barIndex) =>
                    <div className={"bar"}> {
                        bar.beats.map((beat, beatIndex) =>
                            <Fragment>
                                {beatIndex == 0 && this.state.edit && <PlusCircle size={18} />}
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
                                    <div className={"lyrics"} contentEditable={this.state.edit}>
                                        {beat.lyrics}
                                    </div>
                                </div>
                                {this.state.edit && <PlusCircle size={18} />}
                            </Fragment>
                        )
                    } </div>)
            }
                {this.state.edit && <PlusCircle size={18} />}
            </div>
        </div >
    }

}

export { Bar, Beat, Sheet }