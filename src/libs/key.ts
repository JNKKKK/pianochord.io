enum Key {
    'C' = 0,
    'C♯' = 1,
    'D♭' = 1,
    'D' = 2,
    'D♯' = 3,
    'E♭' = 3,
    'E' = 4,
    'F' = 5,
    'F♯' = 6,
    'G♭' = 6,
    'G' = 7,
    'G♯' = 8,
    'A♭' = 8,
    'A' = 9,
    'A♯' = 10,
    'B♭' = 10,
    'B' = 11,
    'A♭♭' = 7,
    'B♭♭' = 9,
    'C♭♭' = 10,
    'D♭♭' = 0,
    'E♭♭' = 2,
    'F♭♭' = 3,
    'G♭♭' = 5,
    'A♯♯' = 11,
    'B♯♯' = 1,
    'C♯♯' = 2,
    'D♯♯' = 4,
    'E♯♯' = 6,
    'F♯♯' = 7,
    'G♯♯' = 9
}

enum bw {
    'white' = 0,
    'black' = 1
}

const bwMap = [bw.white, bw.black, bw.white, bw.black, bw.white, bw.white, bw.black, bw.white, bw.black, bw.white, bw.black, bw.white,]

let keySimpleList: string[] = ['C', 'C♯', 'D♭', 'D', 'D♯', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'G♯', 'A♭', 'A', 'A♯', 'B♭', 'B']

let chromaticName: string[] = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']

const OctaveKeyCount = 12

export { Key, keySimpleList, OctaveKeyCount, bw, bwMap, chromaticName }