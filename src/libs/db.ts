import { Chord } from "./chord"
import { chromaticName, KeyName, Keys, keySimpleList, Octave, OctaveKeyCount } from "./key"
import { Note } from "./note"


const chordTable: {
    aliases: string[];
    name: string | null;
    quality: string;
    intervals: number[];
}[] = [
        { "aliases": ["", "M"], "name": "major", "quality": "Major", "intervals": [0, 4, 3] },
        { "aliases": ["m", "min", "-"], "name": "minor", "quality": "Minor", "intervals": [0, 3, 4] },
        { "aliases": ["maj7", "Δ", "ma7", "M7", "Maj7"], "name": "major seventh", "quality": "Major", "intervals": [0, 4, 3, 4] },
        { "aliases": ["7", "dom"], "name": "dominant seventh", "quality": "Major", "intervals": [0, 4, 3, 3] },
        { "aliases": ["m7", "min7", "mi7", "-7"], "name": "minor seventh", "quality": "Minor", "intervals": [0, 3, 4, 3] },
        { "aliases": ["dim", "°", "o"], "name": "diminished", "quality": "Diminished", "intervals": [0, 3, 3] },
        { "aliases": ["m7♭5", "h7", "_7♭5"], "name": "half diminished seventh", "quality": "Diminished", "intervals": [0, 3, 3, 4] },
        { "aliases": ["dim7", "°7", "o7"], "name": "diminished seventh", "quality": "Diminished", "intervals": [0, 3, 3, 3] },
        { "aliases": ["aug", "+", "+5"], "name": "augmented", "quality": "Augmented", "intervals": [0, 4, 4] },
        { "aliases": ["sus2"], "name": "suspended 2nd", "quality": "", "intervals": [0, 2, 5] },
        { "aliases": ["sus4"], "name": "suspended 4th", "quality": "", "intervals": [0, 5, 2] },
        { "aliases": ["maj9", "Δ9"], "name": "major ninth", "quality": "Major", "intervals": [0, 4, 3, 4, 3] },
        { "aliases": ["maj11", "Δ11"], "name": "major eleventh", "quality": "Major", "intervals": [0, 4, 3, 4, 3, 3] },
        { "aliases": ["maj13", "Δ13"], "name": "major thirteenth", "quality": "Major", "intervals": [0, 4, 3, 4, 3, 7] },
        { "aliases": ["6", "add6", "add13", "M6"], "name": "major sixth", "quality": "Major", "intervals": [0, 4, 3, 2] },
        { "aliases": ["6/9", "69"], "name": "sixth/ninth", "quality": "Major", "intervals": [0, 4, 3, 2, 5] },
        { "aliases": ["maj♯4", "Δ♯4", "Δ♯11"], "name": "lydian", "quality": "Major", "intervals": [0, 4, 3, 4, 7] },
        { "aliases": ["M7♭6"], "name": "major seventh ♭6", "quality": "Major", "intervals": [0, 4, 4, 3] },
        { "aliases": ["mM7", "m/ma7", "m/maj7", "m/M7", "-Δ7", "mΔ"], "name": "minor/major seventh", "quality": "Minor", "intervals": [0, 3, 4, 4] },
        { "aliases": ["m6"], "name": "minor sixth", "quality": "Minor", "intervals": [0, 3, 4, 2] },
        { "aliases": ["m9"], "name": "minor ninth", "quality": "Minor", "intervals": [0, 3, 4, 3, 4] },
        { "aliases": ["m11"], "name": "minor eleventh", "quality": "Minor", "intervals": [0, 3, 4, 3, 4, 3] },
        { "aliases": ["m13"], "name": "minor thirteenth", "quality": "Minor", "intervals": [0, 3, 4, 3, 4, 7] },
        { "aliases": ["9"], "name": "dominant ninth", "quality": "Major", "intervals": [0, 4, 3, 3, 4] },
        { "aliases": ["11"], "name": "dominant eleventh", "quality": "", "intervals": [0, 7, 3, 4, 3] },
        { "aliases": ["13"], "name": "dominant thirteenth", "quality": "Major", "intervals": [0, 4, 3, 3, 4, 7] },
        { "aliases": ["7♯11", "7♯4"], "name": "lydian dominant seventh", "quality": "Major", "intervals": [0, 4, 3, 3, 8] },
        { "aliases": ["7♭9"], "name": "dominant ♭9", "quality": "Major", "intervals": [0, 4, 3, 3, 3] },
        { "aliases": ["7♯9"], "name": "dominant ♯9", "quality": "Major", "intervals": [0, 4, 3, 3, 5] },
        { "aliases": ["alt7"], "name": "altered", "quality": "Major", "intervals": [0, 4, 6, 3] },
        { "aliases": ["7sus4"], "name": "suspended 4th seventh", "quality": "", "intervals": [0, 5, 2, 3] },
        { "aliases": ["♭9sus", "phryg"], "name": "suspended 4th ♭9", "quality": "", "intervals": [0, 5, 2, 3, 3] },
        { "aliases": ["5"], "name": "fifth", "quality": "", "intervals": [0, 7] },
        { "aliases": ["maj7♯5", "maj7+5"], "name": "augmented seventh", "quality": "Augmented", "intervals": [0, 4, 4, 3] },
        { "aliases": ["maj9♯11", "Δ9♯11"], "name": "major ♯11 (lydian)", "quality": "Major", "intervals": [0, 4, 3, 4, 3, 4] },
        { "aliases": ["sus24", "sus4add9"], "name": null, "quality": "", "intervals": [0, 2, 3, 2] },
        { "aliases": ["M♭6"], "name": null, "quality": "Major", "intervals": [0, 4, 4] },
        { "aliases": ["maj9♯5", "Maj9♯5"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 3, 3] },
        { "aliases": ["7♯5", "+7", "7aug", "aug7"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 2] },
        { "aliases": ["7♯5♯9", "7alt", "7♯5♯9_", "7♯9♭13_"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 2, 5] },
        { "aliases": ["9♯5", "9+"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 2, 4] },
        { "aliases": ["9♯5♯11"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 2, 4, 4] },
        { "aliases": ["7♯5♭9"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 2, 3] },
        { "aliases": ["7♯5♭9♯11"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 2, 3, 5] },
        { "aliases": ["+add♯9"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 7] },
        { "aliases": ["M♯5add9", "+add9"], "name": null, "quality": "Augmented", "intervals": [0, 4, 4, 6] },
        { "aliases": ["M6♯11", "M6♭5", "6♯11", "6♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 2, 9] },
        { "aliases": ["M7add13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 2, 2, 3] },
        { "aliases": ["69♯11"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 2, 5, 4] },
        { "aliases": ["7♭6"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 1, 2] },
        { "aliases": ["maj7♯9♯11"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 4, 4, 3] },
        { "aliases": ["M13♯11", "maj13♯11", "M13+4", "M13♯4"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 4, 3, 4, 3] },
        { "aliases": ["M7♭9"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 4, 2] },
        { "aliases": ["7♯11♭13", "7♭5♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 8, 2] },
        { "aliases": ["7♯9♯11", "7♭5♯9"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 5, 3] },
        { "aliases": ["13♯9♯11"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 5, 3, 3] },
        { "aliases": ["7♯9♯11♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 5, 3, 2] },
        { "aliases": ["13♯9", "13♯9_"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 5, 6] },
        { "aliases": ["7♯9♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 5, 5] },
        { "aliases": ["9♯11", "9+4", "9♯4", "9♯11_", "9♯4_"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 4, 4] },
        { "aliases": ["13♯11", "13+4", "13♯4"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 4, 4, 3] },
        { "aliases": ["9♯11♭13", "9♭5♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 4, 4, 2] },
        { "aliases": ["7♭9♯11", "7♭5♭9"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 3, 5] },
        { "aliases": ["13♭9♯11"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 3, 5, 3] },
        { "aliases": ["7♭9♭13♯11", "7♭9♯11♭13", "7♭5♭9♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 3, 5, 2] },
        { "aliases": ["13♭9"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 3, 8] },
        { "aliases": ["7♭9♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 3, 7] },
        { "aliases": ["7♭9♯9"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 3, 3, 2] },
        { "aliases": ["Madd9", "2", "add9", "add2"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 7] },
        { "aliases": ["Madd♭9"], "name": null, "quality": "Major", "intervals": [0, 4, 3, 6] },
        { "aliases": ["M♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 2] },
        { "aliases": ["13♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 2, 3, 1, 4] },
        { "aliases": ["M7♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 2, 5] },
        { "aliases": ["M9♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 2, 5, 3] },
        { "aliases": ["7♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 2, 4] },
        { "aliases": ["9♭5"], "name": null, "quality": "Major", "intervals": [0, 4, 2, 4, 4] },
        { "aliases": ["7no5"], "name": null, "quality": "Major", "intervals": [0, 4, 6] },
        { "aliases": ["7♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 6, 10] },
        { "aliases": ["9no5"], "name": null, "quality": "Major", "intervals": [0, 4, 6, 4] },
        { "aliases": ["13no5"], "name": null, "quality": "Major", "intervals": [0, 4, 6, 4, 7] },
        { "aliases": ["9♭13"], "name": null, "quality": "Major", "intervals": [0, 4, 6, 4, 6] },
        { "aliases": ["madd4"], "name": null, "quality": "Minor", "intervals": [0, 3, 2, 2] },
        { "aliases": ["m♯5", "m+", "m♭6"], "name": null, "quality": "Augmented", "intervals": [0, 3, 5] },
        { "aliases": ["m69", "_69"], "name": null, "quality": "Minor", "intervals": [0, 3, 4, 2, 5] },
        { "aliases": ["mMaj7♭6"], "name": null, "quality": "Minor", "intervals": [0, 3, 4, 1, 3] },
        { "aliases": ["mMaj9♭6"], "name": null, "quality": "Minor", "intervals": [0, 3, 4, 1, 3, 3] },
        { "aliases": ["mMaj9", "-Maj9"], "name": null, "quality": "Minor", "intervals": [0, 3, 4, 4, 3] },
        { "aliases": ["m7add11", "m7add4"], "name": null, "quality": "Minor", "intervals": [0, 3, 4, 3, 7] },
        { "aliases": ["madd9"], "name": null, "quality": "Minor", "intervals": [0, 3, 4, 7] },
        { "aliases": ["o7M7"], "name": null, "quality": "Diminished", "intervals": [0, 3, 3, 3, 2] },
        { "aliases": ["oM7"], "name": null, "quality": "Diminished", "intervals": [0, 3, 3, 5] },
        { "aliases": ["m♭6M7"], "name": null, "quality": "Minor", "intervals": [0, 3, 5, 3] },
        { "aliases": ["m7♯5"], "name": null, "quality": "Minor", "intervals": [0, 3, 5, 2] },
        { "aliases": ["m9♯5"], "name": null, "quality": "Minor", "intervals": [0, 3, 5, 2, 4] },
        { "aliases": ["m11♯5"], "name": null, "quality": "Minor", "intervals": [0, 3, 5, 2, 4, 3] },
        { "aliases": ["m9♭5", "h9", "-9♭5"], "name": null, "quality": "Minor", "intervals": [0, 3, 3, 4, 4] },
        { "aliases": ["m11♭5", "h11", "_11♭5"], "name": null, "quality": "Minor", "intervals": [0, 3, 3, 4, 4, 3] },
        { "aliases": ["m♭6♭9"], "name": null, "quality": "Minor", "intervals": [0, 3, 5, 5] },
        { "aliases": ["M7♯5sus4"], "name": null, "quality": "Augmented", "intervals": [0, 5, 3, 3] },
        { "aliases": ["M9♯5sus4"], "name": null, "quality": "Augmented", "intervals": [0, 5, 3, 3, 3] },
        { "aliases": ["7♯5sus4"], "name": null, "quality": "Augmented", "intervals": [0, 5, 3, 2] },
        { "aliases": ["M7sus4"], "name": null, "quality": "", "intervals": [0, 5, 2, 4] },
        { "aliases": ["M9sus4"], "name": null, "quality": "", "intervals": [0, 5, 2, 4, 3] },
        { "aliases": ["9sus4", "9sus"], "name": null, "quality": "", "intervals": [0, 5, 2, 3, 4] },
        { "aliases": ["13sus4", "13sus"], "name": null, "quality": "", "intervals": [0, 5, 2, 3, 4, 7] },
        { "aliases": ["7sus4♭9♭13", "7♭9♭13sus4"], "name": null, "quality": "", "intervals": [0, 5, 2, 3, 3, 7] },
        { "aliases": ["4", "quartal"], "name": null, "quality": "", "intervals": [0, 5, 5, 5] },
        { "aliases": ["11♭9"], "name": null, "quality": "", "intervals": [0, 7, 3, 3, 4] }
    ]

let locateChordIndex = (name: string) => {
    return chordTable.map((chord, i) => ({ ...chord, i })).filter(chord => chord.name == name)[0].i
}

enum chordIndex {
    maj = locateChordIndex("major"),
    min = locateChordIndex("minor"),
    dim = locateChordIndex("diminished"),
    aug = locateChordIndex("augmented"),
    maj7 = locateChordIndex("major seventh"),
    maj9 = locateChordIndex("major ninth"),
    maj11 = locateChordIndex("major eleventh"),
    maj13 = locateChordIndex("major thirteenth"),
    _6 = locateChordIndex("major sixth"),
    _7 = locateChordIndex("dominant seventh"),
    _9 = locateChordIndex("dominant ninth"),
    _11 = locateChordIndex("dominant eleventh"),
    _13 = locateChordIndex("dominant thirteenth"),
    sus4 = locateChordIndex("suspended 4th"),
    m6 = locateChordIndex("minor sixth"),
    m7 = locateChordIndex("minor seventh"),
    m9 = locateChordIndex("minor ninth"),
    m11 = locateChordIndex("minor eleventh"),
    m7b5 = locateChordIndex("half diminished seventh"),
}

const churchMode = {
    intervals: [2, 2, 1, 2, 2, 2, 1],
    names: ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian",],
    chordProgression: [
        [chordIndex.maj, chordIndex.maj7, chordIndex.maj9, chordIndex.maj11, chordIndex.maj13, chordIndex._6],
        [chordIndex.min, chordIndex.m7, chordIndex.m9, chordIndex.m11, chordIndex.m6],
        [chordIndex.min, chordIndex.m7],
        [chordIndex.maj, chordIndex.maj7, chordIndex.maj9, chordIndex.maj13, chordIndex._6],
        [chordIndex.maj, chordIndex._7, chordIndex._9, chordIndex._11, chordIndex.sus4, chordIndex._13],
        [chordIndex.min, chordIndex.m7, chordIndex.m9, chordIndex.m11],
        [chordIndex.dim, chordIndex.m7b5],
    ]
}

type Mode = {
    name: string,
    chordIndex: number[][]
    rome: string[],
    intervals: number[],
}
const Rome = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii']
let modesTable: Mode[] = []
// fill in church modes
churchMode.names.forEach((name, i) => {
    let mode = {
        name,
        chordIndex: [...churchMode.chordProgression.slice(i), ...churchMode.chordProgression.slice(0, i)],
        rome: [...churchMode.chordProgression.slice(i), ...churchMode.chordProgression.slice(0, i)].map((v, i) => {
            let rome = Rome[i]
            if (v[0] == chordIndex.maj) rome = rome.toUpperCase()
            if (v[0] == chordIndex.dim) rome = rome + '°'
            if (v[0] == chordIndex.aug) rome = rome.toUpperCase() + '+'
            return rome
        }),
        intervals: [...churchMode.intervals.slice(i), ...churchMode.intervals.slice(0, i)]
    }
    modesTable.push(mode)
})
// fill in Major nad Minor modes
modesTable = [
    { ...modesTable[0], name: "Major" },
    { ...modesTable[5], name: "Minor" },
    ...modesTable
]
// fill in "Melodic Minor" and "Harmonic Minor" modes
modesTable = [
    ...modesTable,
    {
        name: "Melodic Minor",
        chordIndex: [[chordIndex.min], [chordIndex.min], [chordIndex.aug], [chordIndex.maj], [chordIndex.maj], [chordIndex.dim], [chordIndex.dim]],
        rome: ['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°'],
        intervals: [2, 1, 2, 2, 2, 2, 1]
    },
    {
        name: "Harmonic Minor",
        chordIndex: [[chordIndex.min], [chordIndex.dim], [chordIndex.aug], [chordIndex.min], [chordIndex.maj], [chordIndex.maj], [chordIndex.dim]],
        rome: ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
        intervals: [2, 1, 2, 2, 1, 3, 1]
    }
]


type Interval = {
    abbrev: string,
    name: string
}

const intervalTable: Record<number, Interval> = {
    0: { abbrev: 'P1', name: 'Root' },
    1: { abbrev: 'm2', name: 'Minor Second' },
    2: { abbrev: 'M2', name: 'Major Second' },
    3: { abbrev: 'm3', name: 'Minor Third' },
    4: { abbrev: 'M3', name: 'Major Third' },
    5: { abbrev: 'P4', name: 'Perfect Fourth' },
    6: { abbrev: 'TT', name: 'Tritone' },
    7: { abbrev: 'P5', name: 'Perfect Fifth' },
    8: { abbrev: 'm6', name: 'Minor Sixth' },
    9: { abbrev: 'M6', name: 'Major Sixth' },
    10: { abbrev: 'm7', name: 'Minor Seventh' },
    11: { abbrev: 'M7', name: 'Major Seventh' },
    12: { abbrev: 'P8', name: 'Perfect Octave' },
}

const inversionNames = [
    'Root Position',
    '1st Inversion',
    '2nd Inversion',
    '3rd Inversion',
]


let notes: Note[] = []
// generate notes from oct 2 to oct 6 (inclusive)
for (let oct = 2; oct <= 6; oct++) {
    for (let k of chromaticName) {
        notes.push(new Note(k, oct as Octave))
    }
}

type chordsDB = {
    [key: string]: Chord[]
}
let chords: chordsDB = {}


keySimpleList.forEach((k: KeyName) => {
    chords[k] = []
    chordTable.forEach(row => {
        let chord = new Chord(Keys[k], row.intervals)
        chord.tonic = k
        let name = row.name ? `${k} ${row.name}` : ''
        let alias = row.aliases.map(str => `${k}${str}`)
        chord.alias = alias
        chord.fullName = name
        chord.quality = row.quality
        chord.calcInversions()
        chords[k].push(chord)
    })
});

// all chords flat list, including inversions
let allChords: Chord[] = []
let allInversions: Chord[] = []
for (let key in chords) {
    chords[key].forEach(c => allChords.push(c))
}
allChords.forEach(c => allInversions.push(...c.inversions))
allChords = [...allChords, ...allInversions]

export { chordTable, intervalTable, notes, chords, inversionNames, allChords, modesTable }