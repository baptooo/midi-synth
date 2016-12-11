const list = document.getElementById('log')
const oscillatorTypes = document.getElementById('oscillatorTypes')
const total = document.getElementById('total')
let midiMessages = 0

if (localStorage.oscillatorType) {
  oscillatorTypes.value = localStorage.oscillatorType
}

oscillatorTypes.addEventListener('change', () => {
  localStorage.oscillatorType = oscillatorTypes.value
})

export function log (note, velocity) {
  while (list.children.length > 25) {
    list.firstChild.remove()
  }

  total.innerHTML = midiMessages++
  list.innerHTML += `
    <li>
      <span>Note: ${note}</span>
      <span>Velocity: ${velocity}</span>
    </li>
  `
}

export function getOscillatorType () {
  return oscillatorTypes.value
}
