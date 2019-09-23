import { interval, coordToInterval } from '../../@tonaljs/tonal/index.esnext';
export { tokenizeInterval as tokenize } from '../../@tonaljs/tonal/index.esnext';

/**
 * Get the natural list of names
 */
function names() {
    return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * simplify("9M") // => "2M"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 * simplify("2M") // => "2M"
 * simplify("-2M") // => "7m"
 */
function simplify(name) {
    const i = interval(name);
    return i.empty ? "" : i.simple + i.q;
}
/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * invert("3m") // => "6M"
 * invert("2M") // => "7m"
 */
function invert(name) {
    const i = interval(name);
    if (i.empty) {
        return "";
    }
    const step = (7 - i.step) % 7;
    const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
    return interval({ step, alt, oct: i.oct, dir: i.dir }).name;
}
// interval numbers
const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
// interval qualities
const IQ = "P m M m M P d P m M m M".split(" ");
/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it"s arbitraty, but deterministic.
 *
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * fromSemitones(7) // => "5P"
 * fromSemitones(-7) // => "-5P"
 */
function fromSemitones(semitones) {
    const d = semitones < 0 ? -1 : 1;
    const n = Math.abs(semitones);
    const c = n % 12;
    const o = Math.floor(n / 12);
    return d * (IN[c] + 7 * o) + IQ[c];
}
function combine(fn) {
    return (a, b) => {
        const coordA = interval(a).coord;
        const coordB = interval(b).coord;
        if (coordA && coordB) {
            const coord = fn(coordA, coordB);
            return coordToInterval(coord).name;
        }
    };
}
/**
 * Adds two intervals
 *
 * @function
 * @param {string} interval1
 * @param {string} interval2
 * @return {string} the added interval name
 * @example
 * import { add } from "@tonaljs/tonal"
 * add("3m", "5P") // => "7m"
 */
const add = combine((a, b) => [a[0] + b[0], a[1] + b[1]]);
/**
 * Subtracts two intervals
 *
 * @function
 * @param {string} minuendInterval
 * @param {string} subtrahendInterval
 * @return {string} the substracted interval name
 * @example
 * import { substract } from '@tonaljs/tonal'
 * substract('5P', '3M') // => '3m'
 * substract('3M', '5P') // => '-3m'
 */
const substract = combine((a, b) => [a[0] - b[0], a[1] - b[1]]);

export { add, fromSemitones, invert, names, simplify, substract };
//# sourceMappingURL=index.esnext.js.map
