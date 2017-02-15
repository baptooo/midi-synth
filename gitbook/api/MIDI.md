# MIDI (index.js)

## Parse MIDI inputs

Request midi access to navigator and listen every MIDI inputs currently connected

```js
navigator.requestMIDIAccess()
  .then(midiAccess => {
    const { inputs } = midiAccess

    inputs.forEach(midi => {
      midi.onmidimessage = onMidiMessage
    })
  })
```

**inputs** is a map of connected input midi controllers

We will loop over this map in order to listen to midi messages for each connected controllers

## Messages bus

A message bus is used to interpret each MIDI message

```js
const onMidiMessage = ({data}) => {
  let [
    type, // Type of action
    note, // Value of the key pressed
    velocity // Pressure velocity for analogic keyboards
  ] = data

  switch (true) {
    case type === 144: // A key is pressed
      // ...
      break
    case type === 128: // A key is released
      // ...
      break
    case type === 176: // Sustain key is pressed or released, depending on velocity value
      // ...
      break
    case type === 224: // Pitch knob is changed, value is own by the velocity
      // ...
      break
    default:
      break
  }
}
```

Actually, these 4 types of action are the only ones supported by "midi-synth", but we could imagine to
extend this for each existing MIDI controller !