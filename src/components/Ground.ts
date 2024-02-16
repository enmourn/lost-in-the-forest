export default class Ground {
  w: number
  h: number
  color: string

  constructor(w: number, h: number, color: string) {
    this.w = w
    this.h = h
    this.color = color
  }

  render({ ctx }: { ctx: CanvasRenderingContext2D }) {
    ctx.fillStyle = this.color
    ctx.fillRect(0, 0, this.w, this.h)
  }
}
