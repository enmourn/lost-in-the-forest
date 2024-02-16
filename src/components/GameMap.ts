import Ground from "./Ground"
import Tree from "./Tree"
import { getRandom } from "../helpers"

export default class GameMap {
  w: number
  h: number
  areaSize: number
  ground: Ground
  areas: Tree[][][]

  constructor(config: {
    w: number
    h: number
    areaSize: number
    trees: { density: number; size: { min: number; max: number }; color: string }
    ground: { color: string }
  }) {
    this.w = config.w
    this.h = config.h
    this.areaSize = config.areaSize
    this.ground = new Ground(this.w, this.h, config.ground.color)
    const columns = Math.ceil(this.w / this.areaSize)
    const rows = Math.ceil(this.h / this.areaSize)
    this.areas = Array.from(Array(columns), () => Array.from(Array(rows), () => []))
    const treesNumber = config.trees.density * this.w * this.h
    for (let i = 0; i < treesNumber; i++) {
      const size = getRandom(config.trees.size.min, config.trees.size.max)
      const position = { x: getRandom(0, this.w), y: getRandom(0, this.h) }
      if (
        position.x > this.w / 2 - 150 &&
        position.x < this.w / 2 + 150 &&
        position.y > this.h / 2 - 150 &&
        position.y < this.h / 2 + 150
      ) {
        i--
        continue
      }
      const tree = new Tree(position.x, position.y, size, config.trees.color)
      const area = this.getAreaByCoord(tree)
      if (area) area.push(tree)
    }
  }

  getAreaByCoord = ({ x, y }: { x: number; y: number }): Tree[] | undefined => {
    const column = Math.floor(x / this.areaSize)
    const row = Math.floor(y / this.areaSize)
    return this.areas?.[column]?.[row]
  }

  getCurrentAreas = ({ x, y }: { x: number; y: number }): Tree[] => {
    const column = Math.floor(x / this.areaSize)
    const row = Math.floor(y / this.areaSize)
    const nearColumn = x / this.areaSize - column > 0.5 ? 1 : -1
    const nearRow = y / this.areaSize - row > 0.5 ? 1 : -1
    return [
      ...(this.areas?.[column]?.[row] ?? []),
      ...(this.areas?.[column + nearColumn]?.[row] ?? []),
      ...(this.areas?.[column]?.[row + nearRow] ?? []),
      ...(this.areas?.[column + nearColumn]?.[row + nearRow] ?? []),
    ]
  }
}
