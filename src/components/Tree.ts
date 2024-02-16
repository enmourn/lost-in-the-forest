export default class Tree {
  x: number
  y: number
  size: number
  color: string

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x
    this.y = y
    this.size = size
    this.color = color
  }

  render({ ctx }: { ctx: CanvasRenderingContext2D }) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}
