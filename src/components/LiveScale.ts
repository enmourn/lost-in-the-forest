export default class LiveScale {
  percent: number
  color: { border: string; body: string }

  constructor(config: { color: { border: string; body: string } }) {
    this.percent = 1
    this.color = config.color
  }

  render({ ctx, element }: { ctx: CanvasRenderingContext2D; element: HTMLCanvasElement }) {
    const width = 300
    ctx.strokeStyle = this.color.border
    ctx.strokeRect(element.width - width - 20, element.height - 40, width, 20)
    ctx.fillStyle = this.color.body
    ctx.fillRect(element.width - width - 19, element.height - 39, width * this.percent - 2, 18)
  }
}
