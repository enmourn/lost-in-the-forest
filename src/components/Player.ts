export default class Player {
  x: number
  y: number
  size: number
  speeds: number[]
  speed: number
  spin: number
  lives: number[]
  live: number
  angle: number
  confuse: { x: -1 | 1; y: -1 | 1 }
  color: string

  constructor(config: {
    x: number
    y: number
    size: number
    speeds: number[]
    spin: number
    lives: number[]
    color: string
  }) {
    this.x = config.x
    this.y = config.y
    this.size = config.size
    this.speeds = config.speeds
    this.speed = this.speeds[0]
    this.spin = config.spin
    this.lives = config.lives
    this.live = this.lives[0]
    this.angle = 0
    this.confuse = { x: Math.random() > 0.5 ? 1 : -1, y: Math.random() > 0.5 ? 1 : -1 }
    this.color = config.color
  }

  render({ ctx }: { ctx: CanvasRenderingContext2D }) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}
