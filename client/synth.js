const context = new AudioContext()
const masterGain = context.createGain()
let nodes = []
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
  nodes.push(oscillator)
}

export function noteOff (note, velocity) {
  if (sustain) {
    return false
  }

  const frequency = frequencyFromNoteNumber(note)

  nodes = nodes.filter(node => {
    if (Math.round(node.frequency.value) === Math.round(frequency)) {
      node.stop()
      node.disconnect()
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

  nodes = nodes.filter(node => {
    node.stop()
    node.disconnect()
    return false
  })
}
