import * as waves from './waves'

const context = new AudioContext()
const releaseDelay = 10
let oscillators = []
let sustain = false

const frequencyFromNoteNumber = (note) => (
  440 * Math.pow(2, (note - 69) / 12)
)

export function noteOn (note, velocity, type = 'triangle') {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  switch (true) {
    case type in waves:
      const real = new Float32Array(waves[type])
      const imag = new Float32Array(real.length)
      oscillator.setPeriodicWave(
        context.createPeriodicWave(real, imag)
      )
      break
    default:
      oscillator.type = type
      break
  }

  oscillator.frequency.value = frequencyFromNoteNumber(note)
  gain.gain.value = 0.3 // velocity / 100

  gain.connect(context.destination)
  oscillator.connect(gain)
  oscillator.start(0)
  oscillators.push({
    oscillator,
    gain,
    frequency: frequencyFromNoteNumber(note)
  })
}

const killOscillator = ({ oscillator, gain }) => {
  const delay = setInterval(() => {
    const value = gain.gain.value * 0.9

    if (value <= 1 / 20) {
      clearInterval(delay)

      oscillator.stop()
      oscillator.disconnect()
      gain.disconnect()
    } else {
      gain.gain.value = value
    }
  }, releaseDelay)

  return false
}

export function noteOff (note, velocity) {
  if (sustain) {
    return false
  }

  const offFrequency = frequencyFromNoteNumber(note)

  oscillators = oscillators.filter((oscillator) => {
    const { frequency } = oscillator

    if (Math.round(frequency) === Math.round(offFrequency)) {
      killOscillator(oscillator)
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

  oscillators = oscillators.filter(killOscillator)
}

export function pitchChange (value) {
  // pitch = (value - 64)
  const pitch = value - 64
  oscillators.forEach(({ oscillator, frequency }) => {
    oscillator.frequency.value = frequency + pitch
  })
}
