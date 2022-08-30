import { Key } from "./key";

let initialized = false
let context: AudioContext
let extension: string;

let samples = {
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
}

function init() {
    // Support prefixed AudioContext used in Safari and old Chrome versions.
    let audioContext = window.AudioContext || (window as any).webkitAudioContext;
    context = new audioContext();

    // Polyfill for old callback-based syntax used in Safari.
    if (context.decodeAudioData.length !== 1) {
        const originalDecodeAudioData = context.decodeAudioData.bind(context);
        context.decodeAudioData = buffer =>
            new Promise((resolve, reject) =>
                originalDecodeAudioData(buffer, resolve, reject)
            );
    }

    // determine supported extension
    let audioElm = document.createElement("audio");
    if (audioElm.canPlayType('audio/ogg')) {
        extension = 'ogg';
    } else if (audioElm.canPlayType('audio/mp3')) {
        extension = 'mp3';
    } else if (audioElm.canPlayType('audio/wav')) {
        extension = 'wav';
    } else {
        extension = 'wav';
    }

    initialized = true
}

function loadSample(octave: number) {
    if (samples[octave] === undefined) {
        samples[octave] = 'loading'
        return fetch(`/samples_piano_F${octave}.${extension}`)
            .then(response => response.arrayBuffer())
            .then(buffer => context.decodeAudioData(buffer))
            .then(data => {
                samples[octave] = data
                return data
            })
    } else if (samples[octave] === 'loading') {
        throw Promise.reject(new Error("Duplicate playing action when sample is still loading."))
    } else {
        return Promise.resolve(samples[octave])
    }
}

function playSample(sample: AudioBuffer, key: Key) {
    const source = context.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = 2 ** ((key - Key['F']) / 12);
    source.connect(context.destination);
    source.start(0);
}

let piano = {
    play: (key: Key, octave: number) => {
        if (!initialized) init()
        return loadSample(octave)
            .then(sample => {
                playSample(sample, key)
            })
            .catch(e => {
                console.error(e)
            })
    }
}

export default piano