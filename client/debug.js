const list = document.createElement('ul')
document.body.appendChild(list)

export default function (note, velocity) {
  while (list.children.length > 25) {
    list.firstChild.remove()
  }

  list.innerHTML += `
    <div>
      <span>Note: ${note}</span>
      <span>Velocity: ${velocity}</span>
    </div>
  `
}
