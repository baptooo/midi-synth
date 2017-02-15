// Helper to generate periodic wave from data wave
export const getPeriodicWave = (wave, context) => {
  const real = new Float32Array(wave)
  const imag = new Float32Array(real.length)
  return context.createPeriodicWave(real, imag)
}

export const random = []
export const rhodes = ['0.4', '0.8', '0.6', '0.6', '0.6', '0.6', '0.0', '0.8', '0.3', '1.0']
export const organ = ['0.2', '0.4', '0.0', '0.0', '0.9', '0.1', '0.1', '0.1', '0.2', '0.9']
export const organ2 = [0.5608259910131279, 0.18323919333961336, 0.9449980314543962, 0.07358557583464687, 0.8841613825722621, 0.7048631759361661, 0.025339326184752098, 0.6519546142566628]

const size = (Math.random() * 40 << 0)
for (let i = 0; i < size; i++) {
  random.push(Math.random())
  // random.push(i / size)
}
