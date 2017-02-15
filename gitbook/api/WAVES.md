# Waves

A set of periodic waves for the synthesizer.

# Default waves

For default presets, [OscillatorNode](http://devdocs.io/dom/oscillatornode) has a property **type**.

- [OscillatorNode.type](http://devdocs.io/dom/oscillatornode/type)

This property holds a default preset of waveform that is available inside the WebAudio API

# Custom waves

But, if for some reason you need to create your owns, it is possible with [OscillatorNode.setPeriodicWave](http://devdocs.io/dom/oscillatornode/setperiodicwave)

In midi-synth there is some available custom presets that are generated automatically
 with helper **getPeriodicWave**

```js
export const getPeriodicWave = (wave, context) => {
  const real = new Float32Array(wave)
  const imag = new Float32Array(real.length)
  return context.createPeriodicWave(real, imag)
}
```