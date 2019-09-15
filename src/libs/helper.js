import { chord } from '@tonaljs/chord'
import { entries } from '@tonaljs/chord-dictionary'

function setPossibleNames (chordDataList) {
  chordDataList.forEach(chord => {
    var possibleNames = []
    if (chord.name !== chord.tonic + ' ') {
      possibleNames.push(chord.name)
      possibleNames.push(chord.name.split(' ').join(''))
    }
    chord.aliases.filter(alias => alias).forEach(alias => {
      possibleNames.push(chord.tonic + alias)
      possibleNames.push(chord.tonic + ' ' + alias)
    })
    chord.possibleNames = possibleNames
  })
}

var keySelectorList = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
var ChordSortTable = ['1P 3M 5P', '1P 3M 5P 7M', '1P 3M 5P 7M 9M', '1P 3M 5P 7M 9M 13M', '1P 3M 5P 6M', '1P 3M 5P 6M 9M', '1P 3M 5P 7M 11A', '1P 3M 6m 7M', '1P 3m 5P', '1P 3m 5P 7m', '1P 3m 5P 7M', '1P 3m 5P 6M', '1P 3m 5P 7m 9M', '1P 3m 5P 7m 9M 11P', '1P 3m 5P 7m 9M 13M', '1P 3m 5d', '1P 3m 5d 7d', '1P 3m 5d 7m', '1P 3M 5P 7m', '1P 3M 5P 7m 9M', '1P 3M 5P 7m 9M 13M', '1P 3M 5P 7m 11A', '1P 3M 5P 7m 9m', '1P 3M 5P 7m 9A', '1P 3M 7m 9m', '1P 4P 5P', '1P 2M 5P', '1P 4P 5P 7m', '1P 5P 7m 9M 11P', '1P 4P 5P 7m 9m', '1P 5P', '1P 3M 5A', '1P 3M 5A 7M', '1P 3M 5P 7M 9M 11A', '1P 3M 5P 7m 9A', '1P 2M 4P 5P', '1P 3M 13m', '1P 3M 5A 7M 9M', '1P 3M 5A 7m', '1P 3M 5A 7m 9A', '1P 3M 5A 7m 9M', '1P 3M 5A 7m 9M 11A', '1P 3M 5A 7m 9m', '1P 3M 5A 7m 9m 11A', '1P 3M 5A 9A', '1P 3M 5A 9M', '1P 3M 5P 6M 11A', '1P 3M 5P 6M 7M 9M', '1P 3M 5P 6M 9M 11A', '1P 3M 5P 6m 7m', '1P 3M 5P 7M 9A 11A', '1P 3M 5P 7M 9M 11A 13M', '1P 3M 5P 7M 9m', '1P 3M 5P 7m 11A 13m', '1P 3M 5P 7m 13M', '1P 3M 5P 7m 9A 11A', '1P 3M 5P 7m 9A 11A 13M', '1P 3M 5P 7m 9A 11A 13m', '1P 3M 5P 7m 9A 13M', '1P 3M 5P 7m 9A 13m', '1P 3M 5P 7m 9M 11A', '1P 3M 5P 7m 9M 11A 13M', '1P 3M 5P 7m 9M 11A 13m', '1P 3M 5P 7m 9m 11A', '1P 3M 5P 7m 9m 11A 13M', '1P 3M 5P 7m 9m 11A 13m', '1P 3M 5P 7m 9m 13M', '1P 3M 5P 7m 9m 13m', '1P 3M 5P 7m 9m 9A', '1P 3M 5P 9M', '1P 3M 5P 9m', '1P 3M 5d', '1P 3M 5d 6M 7m 9M', '1P 3M 5d 7M', '1P 3M 5d 7M 9M', '1P 3M 5d 7m', '1P 3M 5d 7m 9M', '1P 3M 7m', '1P 3M 7m 13m', '1P 3M 7m 9M', '1P 3M 7m 9M 13M', '1P 3M 7m 9M 13m', '1P 3m 4P 5P', '1P 3m 5A', '1P 3m 5P 6M 9M', '1P 3m 5P 6m 7M', '1P 3m 5P 6m 7M 9M', '1P 3m 5P 7M 9M', '1P 3m 5P 7m 11P', '1P 3m 5P 9M', '1P 3m 5d 6M 7M', '1P 3m 5d 7M', '1P 3m 5d 7m', '1P 3m 6m 7M', '1P 3m 6m 7m', '1P 3m 6m 7m 9M', '1P 3m 6m 7m 9M 11P', '1P 3m 6m 9m', '1P 3m 7m 12d 2M', '1P 3m 7m 12d 2M 4P', '1P 4P 5A 7M', '1P 4P 5A 7M 9M', '1P 4P 5A 7m', '1P 4P 5P 7M', '1P 4P 5P 7M 9M', '1P 4P 5P 7m 9M', '1P 4P 5P 7m 9M 13M', '1P 4P 5P 7m 9m 13m', '1P 4P 7m 10m', '1P 5P 7m 9m 11P']
var chordData = {}
var chordTypes = entries()

keySelectorList.forEach(key => {
  chordData[key] = chordTypes.map(ct => {
    let displayName
    if (ct.name) {
      displayName = ct.name
    } else {
      displayName = ct.aliases[0]
    }
    return chord(key + ' ' + displayName)
  })
  setPossibleNames(chordData[key])
  chordData[key].sort((a, b) => ChordSortTable.indexOf(a.intervals.join(' ')) - ChordSortTable.indexOf(b.intervals.join(' ')))
})

export { chordData }
