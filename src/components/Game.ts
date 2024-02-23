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

    this.start()
  }

  start = () => {
    const { loop, keyboard, alert } = this

    loop.pause()
    alert.status = "about"

    keyboard.pressOnce("Enter", () => {
      alert.status = "intro"
      keyboard.pressOnce("Enter", () => {
        alert.status = "start"
        keyboard.pressOnce("Enter", () => {
          alert.status = null
          loop.start()
        })
      })
    })
  }

  restart = () => {
    const game = this
    const { map, player, gps, alert } = this

    alert.status = null
    player.live = player.lives[0]
    player.speed = player.speeds[0]
    player.x = map.w / 2
    player.y = map.h / 2
    game.level = 1
    gps.restart()
  }

  update = () => {
    const game = this
    const { map, loop, keyboard, player, liveScale, gps, alert } = this

    if (player.x < 0 || player.x > map.w || player.y < 0 || player.y > map.h) {
      loop.pause()
      alert.status = "win"
      keyboard.pressOnce("Enter", () => {
        game.restart()
        loop.start()
      })
    }

    if (player.live <= 0) {
      loop.pause()
      if (game.level == 1) alert.status = "attempt1"
      if (game.level == 2) alert.status = "attempt2"
      if (game.level == 3) alert.status = "loss"
      keyboard.pressOnce("Enter", () => {
        if (game.level == 1 || game.level == 2) {
          alert.status = null
          player.live = player.lives[game.level]
          player.speed = player.speeds[game.level]
          game.level++
          loop.start()
        } else {
          game.restart()
          loop.start()
        }
      })
    }

    player.live--
    liveScale.percent = player.live / player.lives[0]

    const direction = { x: -keyboard.left + +keyboard.right, y: -keyboard.up + +keyboard.down }
    const speed = player.speed / (direction.x !== 0 && direction.y !== 0 ? Math.SQRT2 : 1)
    const angle = { sin: Math.sin(getRadians(player.angle)), cos: Math.cos(getRadians(player.angle)) }
    const coord = {
      x: player.x + direction.y * speed * angle.sin + direction.x * speed * angle.cos,
      y: player.y + direction.y * speed * angle.cos - direction.x * speed * angle.sin,
    }
    const areas = map.getCurrentAreas(coord)

    let intersection = false

    for (let tree of areas) {
      intersection = checkCirclesIntersection(
        { x: coord.x, y: coord.y, r: player.size },
        { x: tree.x, y: tree.y, r: tree.size }
      )
      if (intersection) break
    }

    if (!intersection) {
      player.x = coord.x
      player.y = coord.y
      if (direction.y) {
        player.angle += player.spin * direction.y * player.confuse.x
      } else if (direction.x) {
        player.angle += player.spin * direction.x * player.confuse.y
      }
    }

    gps.setCoord(player.x, player.y)
  }

  render = () => {
    const { canvas, map, keyboard, player, liveScale, gps, alert } = this

    canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height)
    canvas.ctx.scale(canvas.scale, canvas.scale)

    canvas.ctx.translate(
      canvas.element.width / canvas.scale / 2 - player.x,
      canvas.element.height / canvas.scale / 2 - player.y
    )

    const playerAngle = getRadians(player.angle)

    canvas.ctx.translate(player.x, player.y)
    canvas.ctx.rotate(playerAngle)
    canvas.ctx.translate(-player.x, -player.y)
    map.ground.render(canvas)
    map.getCurrentAreas(player).forEach((tree) => tree.render(canvas))

    canvas.ctx.translate(player.x, player.y)
    canvas.ctx.rotate(-playerAngle)
    canvas.ctx.translate(-player.x, -player.y)
    player.render(canvas)

    canvas.ctx.resetTransform()
    liveScale.render(canvas)

    if (alert.status) alert.render(canvas)
    if (keyboard.g && !alert.status) gps.render(canvas)
  }
}
