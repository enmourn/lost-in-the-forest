import Canvas from "./Canvas"
import GameMap from "./GameMap"
import GameLoop from "./GameLoop"
import Keyboard from "./Keyboard"
import Player from "./Player"
import LiveScale from "./LiveScale"
import GPS from "./GPS"
import Alert from "./Alert"
import { checkCirclesIntersection, getRadians } from "../helpers"

export default class Game {
  canvas: Canvas
  map: GameMap
  loop: GameLoop
  keyboard: Keyboard
  player: Player
  liveScale: LiveScale
  gps: GPS
  alert: Alert
  level: number

  constructor(config: {
    viewport: { w: number; h: number }
    map: Omit<ConstructorParameters<typeof GameMap>[0], "areaSize">
    player: Omit<ConstructorParameters<typeof Player>[0], "x" | "y">
    liveScale: ConstructorParameters<typeof LiveScale>[0]
    gps: Omit<ConstructorParameters<typeof GPS>[0], "map">
    alert: ConstructorParameters<typeof Alert>[0]
    fps: number
  }) {
    this.canvas = new Canvas(config.viewport)
    const areaSize = Math.sqrt(Math.pow(config.viewport.w, 2) + Math.pow(config.viewport.h, 2))
    this.map = new GameMap({ ...config.map, areaSize })
    this.keyboard = new Keyboard()
    this.loop = new GameLoop({ fps: config.fps, update: this.update, render: this.render })
    this.player = new Player({ ...config.player, x: this.map.w / 2, y: this.map.h / 2 })
    this.liveScale = new LiveScale(config.liveScale)
    this.gps = new GPS({ map: config.map, ...config.gps })
    this.alert = new Alert(config.alert)
    this.level = 1

    this.keyboard.pressOnce("Enter", () => {
      this.alert.status = "intro"
      this.keyboard.pressOnce("Enter", () => {
        this.alert.status = "start"
        this.keyboard.pressOnce("Enter", () => {
          this.alert.status = null
          this.loop.start()
        })
        this.render()
      })
      this.render()
    })

    window.onresize = () => {
      this.canvas.resize()
      this.render()
    }

    this.render()
  }

  restart = () => {
    this.alert.status = null
    this.player.live = this.player.lives[0]
    this.player.speed = this.player.speeds[0]
    this.player.x = this.map.w / 2
    this.player.y = this.map.h / 2
    this.level = 1
    this.gps.restart()
    this.loop.start()
  }

  update = () => {
    if (this.player.x < 0 || this.player.x > this.map.w || this.player.y < 0 || this.player.y > this.map.h) {
      this.loop.stop()
      this.alert.status = "win"
      this.keyboard.pressOnce("Enter", this.restart)
      return
    }
    if (this.player.live <= 0) {
      this.loop.stop()
      if (this.level == 1) this.alert.status = "attempt1"
      if (this.level == 2) this.alert.status = "attempt2"
      if (this.level == 3) this.alert.status = "loss"
      this.keyboard.pressOnce("Enter", () => {
        if (this.level == 1 || this.level == 2) {
          this.alert.status = null
          this.player.live = this.player.lives[this.level]
          this.player.speed = this.player.speeds[this.level]
          this.level++
          this.loop.start()
        } else {
          this.restart()
        }
      })
      this.render()
    }

    this.player.live--
    this.liveScale.percent = this.player.live / this.player.lives[0]

    const dir = { x: -this.keyboard.left + +this.keyboard.right, y: -this.keyboard.up + +this.keyboard.down }
    const speed = this.player.speed / (dir.x !== 0 && dir.y !== 0 ? Math.SQRT2 : 1)
    const angle = { sin: Math.sin(getRadians(this.player.angle)), cos: Math.cos(getRadians(this.player.angle)) }
    const coord = {
      x: this.player.x + dir.y * speed * angle.sin + dir.x * speed * angle.cos,
      y: this.player.y + dir.y * speed * angle.cos - dir.x * speed * angle.sin,
    }
    const areas = this.map.getCurrentAreas(coord)

    let intersection = false
    for (let tree of areas) {
      intersection = checkCirclesIntersection(
        { x: coord.x, y: coord.y, r: this.player.size },
        { x: tree.x, y: tree.y, r: tree.size }
      )
      if (intersection) break
    }

    if (!intersection) {
      this.player.x = coord.x
      this.player.y = coord.y
      if (dir.y) {
        this.player.angle += 0.01 * dir.y * this.player.confuse.x
      } else if (dir.x) {
        this.player.angle += 0.01 * dir.x * this.player.confuse.y
      }
    }

    this.gps.setCoord(this.player.x, this.player.y)
  }

  render = () => {
    this.canvas.ctx.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height)
    this.canvas.ctx.scale(this.canvas.scale, this.canvas.scale)

    this.canvas.ctx.translate(
      this.canvas.element.width / this.canvas.scale / 2 - this.player.x,
      this.canvas.element.height / this.canvas.scale / 2 - this.player.y
    )

    const angle = getRadians(this.player.angle)

    this.canvas.ctx.translate(this.player.x, this.player.y)
    this.canvas.ctx.rotate(angle)
    this.canvas.ctx.translate(-this.player.x, -this.player.y)
    this.map.ground.render(this.canvas)
    const areas = this.map.getCurrentAreas(this.player)
    areas.forEach((tree) => tree.render(this.canvas))

    this.canvas.ctx.translate(this.player.x, this.player.y)
    this.canvas.ctx.rotate(-angle)
    this.canvas.ctx.translate(-this.player.x, -this.player.y)
    this.player.render(this.canvas)

    this.canvas.ctx.resetTransform()
    this.liveScale.render(this.canvas)

    if (this.alert.status) {
      this.alert.render(this.canvas)
    }
    if (this.keyboard.g && !this.alert.status) {
      this.gps.render(this.canvas)
    }
  }
}
