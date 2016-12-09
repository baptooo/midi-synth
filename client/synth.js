const context = new AudioContext()
const masterGain = context.createGain()
let oscillators = []
let sustain = false

masterGain.gain.value = 0.3
masterGain.connect(context.destination)

const frequencyFromNoteNumber = (note) => (
  440 * Math.pow(2, (note - 69) / 12)
)

export function noteOn (note, velocity) {
  const oscillator = context.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.value = frequencyFromNoteNumber(note)
  oscillator.connect(masterGain)
  oscillator.start(0)
  oscillators.push({
    oscillator,
    frequency: frequencyFromNoteNumber(note)
  })
}

export function noteOff (note, velocity) {
  if (sustain) {
    return false
  }

  const offFrequency = frequencyFromNoteNumber(note)

  oscillators = oscillators.filter(({ oscillator, frequency }) => {
    if (Math.round(frequency) === Math.round(offFrequency)) {
      oscillator.stop()
      oscillator.disconnect()
      return false
    }
    return true
  })
}

export function sustainOn () {
  sustain = true
}

export function sustainOff () {
  sustain = false

  oscillators = oscillators.filter(({ oscillator }) => {
    oscillator.stop()
    oscillator.disconnect()
    return false
  })
}

export function pitchChange (value) {
  // pitch = (value - 64)
  const pitch = value - 64
  oscillators.forEach(({ oscillator, frequency }) => {
    oscillator.frequency.value = frequency + pitch
  })
}
