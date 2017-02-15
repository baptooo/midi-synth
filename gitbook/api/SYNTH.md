# Synthesizer (synth.js)

The synthesizer is an api that exposes all the functions to produce the
sounds associated to each different midi messages

## Initialization

The minimum required to produce a sound is to create an [AudioContext](http://devdocs.io/dom/audiocontext)

```js
const context = new AudioContext()
```

# noteOn

```js
export function noteOn (note, velocity, type = 'triangle') {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const frequency = frequencyFromNoteNumber(note)

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.value = 0.3

  gain.connect(context.destination)
  oscillator.connect(gain)
  oscillator.start(1)
  oscillators.push({
    oscillator,
    gain,
    frequency
  })
}
```

**oscillator** is an instance of [OscillatorNode](http://devdocs.io/dom/oscillatornode) that
represents a periodic wave form and will allow us to produce a tone

**gain** is an instance of [GainNode](http://devdocs.io/dom/gainnode) that
will allow us to modify the volume of the context. It acts between an input and an output
in order to modify the signal that will be used to produce a sound.

**frequency** is the result of the conversion of the midi note and the real sound frequency

After what we can :
- connect the oscillator to the gain
- connect the gain to the context destination (speakers)

**[Oscillators]** -> **[Effects (Gain, Delay, Panner, etc.)]** -> **[Context destination]**

Each created oscillator is stored into an array

### Oscillator

In this example we will use the preset 'sine' as its type. You can create your own
periodic waves, we will talk about it in the [Waves](WAVES.md) section.

### Gain

The value **0.3** that we assign means that the sound will be 30% higher

# noteOff

```js
export function noteOff (note, velocity) {
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
```

This function will search for each active oscillator using the given note and kill it

# killOscillator

```js
const killOscillator = ({ oscillator, gain }) => {
  oscillator.stop()
  oscillator.disconnect()
  gain.disconnect()

  return false
}
```

This function is not exported but it is important to know that the oscillator will be correctly
stopped and disconnected from the audio context. So whenever you release an action on the
midi controller, it will be completely destroyed.

# pitchChange

```js
export function pitchChange (value) {
  const pitch = value - 32
  oscillators.forEach(({ oscillator, frequency }) => {
    oscillator.frequency.value = frequency + pitch
  })
}
```

Pitch change will adjust all oscillators with the given value