import { chordType, entries as entries1 } from '../../@tonaljs/chord-dictionary/index.esnext';
import { isSupersetOf, isSubsetOf } from '../../@tonaljs/pcset/index.esnext';
import { entries } from '../../@tonaljs/scale-dictionary/index.esnext';
import { tokenizeNote, note, transpose as transpose$1 } from '../../@tonaljs/tonal/index.esnext';

const NoChord = {
    empty: true,
    name: "",
    type: "",
    tonic: null,
    setNum: NaN,
    quality: "Unknown",
    chroma: "",
    normalized: "",
    aliases: [],
    notes: [],
    intervals: []
};
// 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)
const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * tokenize("Cmaj7") // => [ "C", "maj7" ]
 * tokenize("C7") // => [ "C", "7" ]
 * tokenize("mMaj7") // => [ null, "mMaj7" ]
 * tokenize("Cnonsense") // => [ null, "nonsense" ]
 */
function tokenize(name) {
    const [lt, acc, oct, type] = tokenizeNote(name);
    if (lt === "") {
        return ["", name];
    }
    // aug is augmented (see https://github.com/danigb/tonal/issues/55)
    if (lt === "A" && type === "ug") {
        return ["", "aug"];
    }
    // see: https://github.com/tonaljs/tonal/issues/70
    if (!type && (oct === "4" || oct === "5")) {
        return [lt + acc, oct];
    }
    if (NUM_TYPES.test(oct)) {
        return [lt + acc, oct + type];
    }
    else {
        return [lt + acc + oct, type];
    }
}
/**
 * Get a Chord from a chord name.
 */
function chord(src) {
    const tokens = Array.isArray(src) ? src : tokenize(src);
    const tonic = note(tokens[0]).name;
    const st = chordType(tokens[1]);
    if (st.empty || src === "") {
        return NoChord;
    }
    const type = st.name;
    const notes = tonic
        ? st.intervals.map(i => transpose$1(tonic, i))
        : [];
    const name = tonic ? tonic + " " + type : type;
    return { ...st, name, type, tonic, notes };
}
/**
 * Transpose a chord name
 *
 * @param {string} chordName - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * transpose('Dm7', 'P4') // => 'Gm7
 */
function transpose(chordName, interval) {
    const [tonic, type] = tokenize(chordName);
    if (!tonic) {
        return name;
    }
    return transpose$1(tonic, interval) + type;
}
/**
 * Get all scales where the given chord fits
 *
 * @example
 * chordScales('C7b9')
 * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */
function chordScales(name) {
    const s = chord(name);
    const isChordIncluded = isSupersetOf(s.chroma);
    return entries()
        .filter(scale => isChordIncluded(scale.chroma))
        .map(scale => scale.name);
}
/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @example
 * extended("CMaj7")
 * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
 */
function extended(chordName) {
    const s = chord(chordName);
    const isSuperset = isSupersetOf(s.chroma);
    return entries1()
        .filter(chord => isSuperset(chord.chroma))
        .map(chord => s.tonic + chord.aliases[0]);
}
/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */
function reduced(chordName) {
    const s = chord(chordName);
    const isSubset = isSubsetOf(s.chroma);
    return entries1()
        .filter(chord => isSubset(chord.chroma))
        .map(chord => s.tonic + chord.aliases[0]);
}

export { chord, chordScales, extended, reduced, tokenize, transpose };
//# sourceMappingURL=index.esnext.js.map
