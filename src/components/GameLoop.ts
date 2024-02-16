export default class GameLoop {
  isRunning: boolean
  timeStart: number
  timeStep: number
  update: () => void
  render: () => void

  constructor(config: { fps: number; update: () => void; render: () => void }) {
    this.isRunning = false
    this.timeStart = 0
    this.timeStep = 1000 / config.fps
    this.update = config.update
    this.render = config.render
  }

  loop = (timeStemp: number) => {
    if (!this.isRunning) {
      this.timeStart = 0
      return
    }
    if (this.timeStart === 0) this.timeStart = timeStemp
    while (this.timeStart <= timeStemp) {
      if (!this.isRunning) break
      this.update()
      this.timeStart += this.timeStep
    }
    this.render()
    requestAnimationFrame(this.loop)
  }

  start = () => {
    if (this.isRunning) return
    this.isRunning = true
    requestAnimationFrame(this.loop)
  }

  stop = () => {
    this.isRunning = false
  }
}
