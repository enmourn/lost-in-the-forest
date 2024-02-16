export default class GPS {
  map: { w: number; h: number }
  margin: number
  color: { overlay: string; bg: string; way: string; oldWay: string }
  way: { x: number; y: number }[]
  oldWays: { x: number; y: number }[][]
  counter: number

  constructor(config: {
    map: { w: number; h: number }
    margin: number
    color: { overlay: string; bg: string; way: string; oldWay: string }
  }) {
    this.map = config.map
    this.margin = config.margin
    this.color = config.color
    this.way = []
    this.oldWays = []
    this.counter = 0
  }

  setCoord = (x: number, y: number) => {
    if (this.counter === 0) {
      this.way.push({ x: x, y: y })
      this.counter = 120 * 5
    }
    this.counter--
  }

  render = ({ ctx, element }: { ctx: CanvasRenderingContext2D; element: HTMLCanvasElement }) => {
    if (!this.way.length) return

    const scale = Math.min(
      (element.width - this.margin * 2) / this.map.w,
      (element.height - this.margin * 2) / this.map.h
    )
    const offset = {
      x: (element.width - this.map.w * scale) / 2,
      y: (element.height - this.map.h * scale) / 2,
    }

    ctx.fillStyle = this.color.overlay
    ctx.fillRect(0, 0, element.width, element.height)
    ctx.fillStyle = this.color.bg
    ctx.fillRect(offset.x, offset.y, this.map.w * scale, this.map.h * scale)

    const renderWay = (way: { x: number; y: number }[], color: string) => {
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(way[0].x * scale + offset.x, way[0].y * scale + offset.y)
      way.forEach((coord) => ctx.lineTo(coord.x * scale + offset.x, coord.y * scale + offset.y))
      ctx.stroke()
    }

    renderWay(this.way, this.color.way)
    this.oldWays.forEach((way) => renderWay(way, this.color.oldWay))

    const lastCoord = this.way[this.way.length - 1]
    ctx.beginPath()
    ctx.moveTo(lastCoord.x * scale + offset.x, lastCoord.y * scale + offset.y)
    ctx.lineTo(lastCoord.x * scale + offset.x - 6, lastCoord.y * scale + offset.y - 8)
    ctx.lineTo(lastCoord.x * scale + offset.x + 6, lastCoord.y * scale + offset.y - 8)
    ctx.fillStyle = this.color.way
    ctx.fill()
  }

  restart() {
    this.oldWays.push(this.way)
    this.counter = 0
    this.way = []
  }
}
