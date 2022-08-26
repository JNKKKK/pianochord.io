type SoundProfile = {
	name: string,
	attack: (sampleRate: number, frequency: number, volume: number) => number,
	dampen: (sampleRate: number, frequency: number, volume: number) => number,
	wave: (sync: AudioSynth, i: number, sampleRate: number, frequency: number, volume: number) => number,
}

type modulationFunction = (i: number, sampleRate: number, frequency: number, x: number) => number

let pack = function (c: number, arg: number) {
	return [new Uint8Array([arg, arg >> 8]), new Uint8Array([arg, arg >> 8, arg >> 16, arg >> 24])][c];
};

class AudioSynth {
	_debug = false
	_bitsPerSample = 16
	_channels = 1
	_sampleRate = 44100
	_volume = 32768
	_notes = {
		'C': 261.63,
		'C#': 277.18,
		'D': 293.66,
		'D#': 311.13,
		'E': 329.63,
		'F': 346.23,
		'F#': 369.99,
		'G': 392.00,
		'G#': 415.30,
		'A': 440.00,
		'A#': 466.16,
		'B': 493.88
	}
	_fileCache: any[] = []
	_temp: { valueTable?: number[], playVal?: number, periodCount?: number } = {}
	_sounds: SoundProfile[] = []
	_mod: modulationFunction[] = [(i, s, f, x) => {
		return Math.sin((2 * Math.PI) * (i / s) * f + x);
	}]

	constructor() {
		let URL = window.URL || window.webkitURL;
		let Blob = window.Blob;
		if (!URL || !Blob) {
			throw new Error('This browser does not support AudioSynth');
		}
		this._resizeCache();
	}

	setSampleRate(v: number) {
		this._sampleRate = Math.max(Math.min(v | 0, 44100), 4000);
		this._clearCache();
		return this._sampleRate;
	}
	getSampleRate() {
		return this._sampleRate;
	}

	setVolume(v: number) {
		v = Math.round(v * 32768);
		this._volume = Math.max(Math.min(v | 0, 32768), 0);
		this._clearCache();
		return this._volume;
	}
	getVolume() {
		return Math.round(this._volume / 32768 * 10000) / 10000;
	}
	_resizeCache() {
		let f = this._fileCache;
		let l = this._sounds.length;
		while (f.length < l) {
			let octaveList = [];
			for (let i = 0; i < 8; i++) {
				let noteList: any[] = [];
				for (let k in this._notes) {
					noteList[k] = {};
				}
				octaveList.push(noteList);
			}
			f.push(octaveList);
		}
	}
	_clearCache() {
		this._fileCache = [];
		this._resizeCache();
	}
	generate(sound: number, note: string, octave: number, duration: number) {
		let thisSound = this._sounds[sound];
		if (!thisSound) {
			throw new Error('Invalid sound or sound ID: ' + sound);
		}
		let t = (new Date()).valueOf();
		this._temp = {};
		octave |= 0;
		octave = Math.min(8, Math.max(1, octave));
		let time = !duration ? 2 : duration;
		if (typeof (this._notes[note]) === 'undefined') {
			throw new Error(note + ' is not a valid note.');
		}
		if (typeof (this._fileCache[sound][octave - 1][note][time]) !== 'undefined') {
			if (this._debug) {
				console.log((new Date()).valueOf() - t, 'ms to retrieve (cached)');
			}
			return this._fileCache[sound][octave - 1][note][time];
		} else {
			let frequency = this._notes[note] * Math.pow(2, octave - 4);
			let sampleRate = this._sampleRate;
			let volume = this._volume;
			let channels = this._channels;
			let bitsPerSample = this._bitsPerSample;
			let attack = thisSound.attack(sampleRate, frequency, volume);
			let dampen = thisSound.dampen(sampleRate, frequency, volume);
			let waveFunc = thisSound.wave;
			let val = 0;

			let data = new Uint8Array(new ArrayBuffer(Math.ceil(sampleRate * time * 2)));
			let attackLen = (sampleRate * attack) | 0;
			let decayLen = (sampleRate * time) | 0;

			for (let i = 0 | 0; i !== attackLen; i++) {

				val = volume * (i / (sampleRate * attack)) * waveFunc(this, i, sampleRate, frequency, volume);

				data[i << 1] = val;
				data[(i << 1) + 1] = val >> 8;

			}

			for (let i = attackLen; i !== decayLen; i++) {

				val = volume * Math.pow((1 - ((i - (sampleRate * attack)) / (sampleRate * (time - attack)))), dampen) * waveFunc(this, i, sampleRate, frequency, volume);

				data[i << 1] = val;
				data[(i << 1) + 1] = val >> 8;

			}

			let out = [
				'RIFF',
				pack(1, 4 + (8 + 24 /* chunk 1 length */) + (8 + 8 /* chunk 2 length */)), // Length
				'WAVE',
				// chunk 1
				'fmt ', // Sub-chunk identifier
				pack(1, 16), // Chunk length
				pack(0, 1), // Audio format (1 is linear quantization)
				pack(0, channels),
				pack(1, sampleRate),
				pack(1, sampleRate * channels * bitsPerSample / 8), // Byte rate
				pack(0, channels * bitsPerSample / 8),
				pack(0, bitsPerSample),
				// chunk 2
				'data', // Sub-chunk identifier
				pack(1, data.length * channels * bitsPerSample / 8), // Chunk length
				data
			];
			let blob = new Blob(out, {
				type: 'audio/wav'
			});
			let dataURI = URL.createObjectURL(blob);
			this._fileCache[sound][octave - 1][note][time] = dataURI;
			if (this._debug) {
				console.log((new Date()).valueOf() - t, 'ms to generate');
			}
			return dataURI;
		}
	}
	play(sound: number, note: string, octave: number, duration: number) {
		let src = this.generate(sound, note, octave, duration);
		let audio = new Audio(src);
		audio.play();
		return true;
	}
	debug() {
		this._debug = true;
	}
	createInstrument(soundName: string) {
		let soundId = this._sounds.findIndex((s => s.name === soundName))
		if (soundId == -1) {
			throw new Error('Invalid sound name: ' + soundName);
		}
		return new AudioSynthInstrument(this, soundId);
	}

	listSounds() {
		return this._sounds.map(s => s.name)
	}

	loadSoundProfile(...profiles: SoundProfile[]) {
		profiles.forEach(p => this._sounds.push(p))
		this._resizeCache();
	}

	loadModulationFunction(...funcs: modulationFunction[]) {
		funcs.forEach(f => this._mod.push(f))
	}

}


class AudioSynthInstrument {
	_parent
	_soundID
	constructor(parent: AudioSynth, soundID: number) {
		this._parent = parent
		this._soundID = soundID
	}
	play(note: string, octave: number, duration: number) {
		return this._parent.play(this._soundID, note, octave, duration);
	}
	generate(note: string, octave: number, duration: number) {
		return this._parent.generate(this._soundID, note, octave, duration);
	}
}

let Synth = new AudioSynth()

Synth.loadModulationFunction(
	function (i, sampleRate, frequency, x) {
		return 1 * Math.sin(2 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 1 * Math.sin(4 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 1 * Math.sin(8 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 1 * Math.sin(0.5 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 1 * Math.sin(0.25 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 0.5 * Math.sin(2 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 0.5 * Math.sin(4 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 0.5 * Math.sin(8 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 0.5 * Math.sin(0.5 * Math.PI * ((i / sampleRate) * frequency) + x);
	},
	function (i, sampleRate, frequency, x) {
		return 0.5 * Math.sin(0.25 * Math.PI * ((i / sampleRate) * frequency) + x);
	}
);



Synth.loadSoundProfile({
	name: 'piano',
	attack: function () {
		return 0.002;
	},
	dampen: function (sampleRate, frequency, volume) {
		return Math.pow(0.5 * Math.log((frequency * volume) / sampleRate), 2);
	},
	wave: function (synth, i, sampleRate, frequency, volume) {
		let base = synth._mod[0];
		return synth._mod[1](
			i,
			sampleRate,
			frequency,
			Math.pow(base(i, sampleRate, frequency, 0), 2) +
			(0.75 * base(i, sampleRate, frequency, 0.25)) +
			(0.1 * base(i, sampleRate, frequency, 0.5))
		);
	}
}, {
	name: 'organ',
	attack: function () {
		return 0.3
	},
	dampen: function (sampleRate, frequency) {
		return 1 + (frequency * 0.01);
	},
	wave: function (synth, i, sampleRate, frequency) {
		let base = synth._mod[0];
		return synth._mod[1](
			i,
			sampleRate,
			frequency,
			base(i, sampleRate, frequency, 0) +
			0.5 * base(i, sampleRate, frequency, 0.25) +
			0.25 * base(i, sampleRate, frequency, 0.5)
		);
	}
}, {
	name: 'acoustic',
	attack: function () {
		return 0.002;
	},
	dampen: function () {
		return 1;
	},
	wave: function (synth, i, sampleRate, frequency) {

		let vars = synth._temp;
		vars.valueTable = !vars.valueTable ? [] : vars.valueTable;
		if (typeof (vars.playVal) === 'undefined') {
			vars.playVal = 0;
		}
		if (typeof (vars.periodCount) === 'undefined') {
			vars.periodCount = 0;
		}

		let valueTable = vars.valueTable;
		let playVal = vars.playVal;
		let periodCount = vars.periodCount;

		let period = sampleRate / frequency;
		let p_hundredth = Math.floor((period - Math.floor(period)) * 100);

		let resetPlay = false;

		if (valueTable.length <= Math.ceil(period)) {

			valueTable.push(Math.round(Math.random()) * 2 - 1);

			return valueTable[valueTable.length - 1];

		} else {

			valueTable[playVal] = (valueTable[playVal >= (valueTable.length - 1) ? 0 : playVal + 1] + valueTable[playVal]) * 0.5;

			if (playVal >= Math.floor(period)) {
				if (playVal < Math.ceil(period)) {
					if ((periodCount % 100) >= p_hundredth) {
						// Reset
						resetPlay = true;
						valueTable[playVal + 1] = (valueTable[0] + valueTable[playVal + 1]) * 0.5;
						vars.periodCount++;
					}
				} else {
					resetPlay = true;
				}
			}

			let _return = valueTable[playVal];
			if (resetPlay) {
				vars.playVal = 0;
			} else {
				vars.playVal++;
			}

			return _return;

		}
	}
}, {
	name: 'edm',
	attack: function () {
		return 0.002;
	},
	dampen: function () {
		return 1;
	},
	wave: function (synth, i, sampleRate, frequency) {
		let base = synth._mod[0];
		let mod = synth._mod.slice(1);
		return mod[0](
			i,
			sampleRate,
			frequency,
			mod[9](
				i,
				sampleRate,
				frequency,
				mod[2](
					i,
					sampleRate,
					frequency,
					Math.pow(base(i, sampleRate, frequency, 0), 3) +
					Math.pow(base(i, sampleRate, frequency, 0.5), 5) +
					Math.pow(base(i, sampleRate, frequency, 1), 7)
				)
			) +
			mod[8](
				i,
				sampleRate,
				frequency,
				base(i, sampleRate, frequency, 1.75)
			)
		);
	}
});

Synth.setVolume(0.4);
export default Synth.createInstrument('piano');;
