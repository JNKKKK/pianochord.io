import { range, compact, rotate } from '../../@tonaljs/array/index.esnext';
import { note, interval } from '../../@tonaljs/tonal/index.esnext';

const EmptyPcset = {
    empty: true,
    name: "",
    setNum: 0,
    chroma: "000000000000",
    normalized: "000000000000",
    intervals: []
};
// UTILITIES
const setNumToChroma = (num) => Number(num).toString(2);
const chromaToNumber = (chroma) => parseInt(chroma, 2);
const REGEX = /^[01]{12}$/;
function isChroma(set) {
    return REGEX.test(set);
}
const isPcsetNum = (set) => typeof set === "number" && set >= 0 && set <= 4095;
const isPcset = (set) => set && isChroma(set.chroma);
const cache = { [EmptyPcset.chroma]: EmptyPcset };
/**
 * Get the pitch class set of a collection of notes or set number or chroma
 */
function pcset(src) {
    const chroma = isChroma(src)
        ? src
        : isPcsetNum(src)
            ? setNumToChroma(src)
            : Array.isArray(src)
                ? listToChroma(src)
                : isPcset(src)
                    ? src.chroma
                    : EmptyPcset.chroma;
    return (cache[chroma] = cache[chroma] || chromaToPcset(chroma));
}
const IVLS = "1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M".split(" ");
/**
 * @private
 * Get the intervals of a pcset *starting from C*
 * @param {Set} set - the pitch class set
 * @return {IntervalName[]} an array of interval names or an empty array
 * if not a valid pitch class set
 */
function chromaToIntervals(chroma) {
    const intervals = [];
    for (let i = 0; i < 12; i++) {
        // tslint:disable-next-line:curly
        if (chroma.charAt(i) === "1")
            intervals.push(IVLS[i]);
    }
    return intervals;
}
let all;
/**
 * Get a list of all possible pitch class sets (all possible chromas) *having
 * C as root*. There are 2048 different chromas. If you want them with another
 * note you have to transpose it
 *
 * @see http://allthescales.org/
 * @return {Array<PcsetChroma>} an array of possible chromas from '10000000000' to '11111111111'
 */
function chromas() {
    all = all || range(2048, 4095).map(setNumToChroma);
    return all.slice();
}
/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|string} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<string>} an array with all the modes of the chroma
 *
 * @example
 * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
 */
function modes(set, normalize = true) {
    const pcs = pcset(set);
    const binary = pcs.chroma.split("");
    return compact(binary.map((_, i) => {
        const r = rotate(i, binary);
        return normalize && r[0] === "0" ? null : r.join("");
    }));
}
/**
 * Test if two pitch class sets are numentical
 *
 * @param {Array|string} set1 - one of the pitch class sets
 * @param {Array|string} set2 - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */
function isEqual(s1, s2) {
    return pcset(s1).setNum === pcset(s2).setNum;
}
/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function is curryfied.
 *
 * @param {PcsetChroma|NoteName[]} set - the superset to test against (chroma or
 * list of notes)
 * @return{function(PcsetChroma|NoteNames[]): boolean} a function accepting a set
 * to test against (chroma or list of notes)
 * @example
 * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */
function isSubsetOf(set) {
    const s = pcset(set).setNum;
    return (notes) => {
        const o = pcset(notes).setNum;
        // tslint:disable-next-line: no-bitwise
        return s && s !== o && (o & s) === o;
    };
}
/**
 * Create a function that test if a collection of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Set} set - an array of notes or a chroma set string to test against
 * @return {(subset: Set): boolean} a function that given a set
 * returns true if is a subset of the first one
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */
function isSupersetOf(set) {
    const s = pcset(set).setNum;
    return (notes) => {
        const o = pcset(notes).setNum;
        // tslint:disable-next-line: no-bitwise
        return s && s !== o && (o | s) === o;
    };
}
/**
 * Test if a given pitch class set includes a note
 *
 * @param {Array<string>} set - the base set to test against
 * @param {string} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * const isNoteInCMajor = isNoteIncludedInSet(['C', 'E', 'G'])
 * isNoteInCMajor('C4') // => true
 * isNoteInCMajor('C#4') // => false
 */
function isNoteIncludedInSet(set) {
    const s = pcset(set);
    return (noteName) => {
        const n = note(noteName);
        return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
    };
}
/** @deprecated use: isNoteIncludedIn */
const includes = isNoteIncludedInSet;
/**
 * Filter a list with a pitch class set
 *
 * @param {Array|string} set - the pitch class set notes
 * @param {Array|string} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */
function filter(set) {
    const isIncluded = isNoteIncludedInSet(set);
    return (notes) => {
        return notes.filter(isIncluded);
    };
}
// PRIVATE //
function chromaRotations(chroma) {
    const binary = chroma.split("");
    return binary.map((_, i) => rotate(i, binary).join(""));
}
function chromaToPcset(chroma) {
    const setNum = chromaToNumber(chroma);
    const normalizedNum = chromaRotations(chroma)
        .map(chromaToNumber)
        .filter(n => n >= 2048)
        .sort()[0];
    const normalized = setNumToChroma(normalizedNum);
    const intervals = chromaToIntervals(chroma);
    return {
        empty: false,
        name: "",
        setNum,
        chroma,
        normalized,
        intervals
    };
}
function listToChroma(set) {
    if (set.length === 0) {
        return EmptyPcset.chroma;
    }
    let pitch;
    const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < set.length; i++) {
        pitch = note(set[i]);
        // tslint:disable-next-line: curly
        if (pitch.empty)
            pitch = interval(set[i]);
        // tslint:disable-next-line: curly
        if (!pitch.empty)
            binary[pitch.chroma] = 1;
    }
    return binary.join("");
}

export { EmptyPcset, chromaToIntervals, chromas, filter, includes, isEqual, isNoteIncludedInSet, isSubsetOf, isSupersetOf, modes, pcset };
//# sourceMappingURL=index.esnext.js.map
