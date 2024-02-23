export default class GameLoop {
  private state: "start" | "pause" | "stop"
  private timeReset: boolean
  private timeStart: number
  private timeStep: number
  private update: () => void
  private render: () => void

  constructor(config: { fps: number; update: () => void; render: () => void }) {
    this.state = "stop"
    this.timeReset = true
    this.timeStart = 0
    this.timeStep = 1000 / config.fps
    this.update = config.update
    this.render = config.render
    requestAnimationFrame(this.loop)
  }

  private loop = (timeStemp: number) => {
    if (this.timeReset) this.timeStart = timeStemp
    while (this.state === "start" && this.timeStart <= timeStemp) {
      this.update()
      this.timeStart += this.timeStep
    }
    if (this.state !== "stop") this.render()
    requestAnimationFrame(this.loop)
  }

  start = () => {
    this.state = "start"
    this.timeReset = true
  }

  pause = () => {
    this.state = "pause"
  }

  stop = () => {
    this.state = "stop"
  }
}
