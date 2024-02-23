export default class Canvas {
  element: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scale: number
  viewport: { w: number; h: number }

  constructor(viewport: { w: number; h: number }) {
    const canvas = document.querySelector("canvas")
    if (!canvas) throw new Error("no canvas element")
    this.element = canvas
    const ctx = this.element.getContext("2d")
    if (!ctx) throw new Error("no canvas context")
    this.ctx = ctx
    this.scale = 1
    this.viewport = viewport
    this.resize()
    window.onresize = this.resize
  }

  resize = () => {
    this.element.width = innerWidth
    this.element.height = innerHeight
    this.scale = Math.max(innerWidth / this.viewport.w, innerHeight / this.viewport.h)
  }
}
