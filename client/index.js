import debug from './debug'
import {
  noteOn,
  noteOff,
  sustainOn,
  sustainOff
} from './synth'

let sustain = false

const onMidiMessage = ({data}) => {
  const [
    type,
    note,
    velocity
  ] = data

  switch (true) {
    case type === 144:
      noteOn(note, velocity)
      debug(note, velocity)
      break
    case type === 128 && !sustain:
      noteOff(note, velocity)
      debug(note, velocity)
      break
    case type === 176:
      velocity ? sustainOn() : sustainOff()
      break
    default:
      break
  }
}

navigator.requestMIDIAccess()
  .then(midiAccess => {
    const {inputs} = midiAccess

    inputs.forEach(midi => {
      midi.onmidimessage = onMidiMessage
    })
  })
