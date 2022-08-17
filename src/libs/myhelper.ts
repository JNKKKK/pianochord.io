import { Chord } from "./chord"
import { chordTable } from "./db"
import { keyMax } from "./key"
import { Note } from "./note"


let notes: Note[] = []

for (let oct = 2; oct <= 6; oct++) {
    for (let k = 0; k <= keyMax; k++) {
        notes.push(new Note(k, oct))
    }
}

let chords: Chord[] = []


chordTable.forEach(row => {
    for (let k = 0; k<= keyMax; k++){
        let chord=new Chord(k,row.intervals)
        chord.names=
        chords.push(new Chord(k,))
    }
})
