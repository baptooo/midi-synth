import { log, getOscillatorType } from './ui'
import {
  noteOn,
  noteOff,
  sustainOn,
  sustainOff,
  pitchChange
} from './synth'

let sustain = false

const onMidiMessage = ({data}) => {
  let [
    type,
    note,
    velocity
  ] = data

  velocity *= 0.5

  switch (true) {
    case type === 144:
      noteOn(note, velocity, getOscillatorType())
      log(note, velocity)
      break
    case type === 128 && !sustain:
      noteOff(note, velocity)
      log(note, velocity)
      break
    case type === 176:
      velocity ? sustainOn() : sustainOff()
      break
    case type === 224:
      pitchChange(velocity)
      log('pitch', velocity)
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
