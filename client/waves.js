export const random = []
export const rhodes = ['0.4', '0.8', '0.6', '0.6', '0.6', '0.6', '0.0', '0.8', '0.3', '1.0']
export const organ = ['0.2', '0.4', '0.0', '0.0', '0.9', '0.1', '0.1', '0.1', '0.2', '0.9']

const size = 4
for (let i = 0; i < size; i++) {
  random.push(Math.random())
  // random.push(i / size)
}
