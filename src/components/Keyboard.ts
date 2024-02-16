export default class Keyboard {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  g: boolean

  constructor() {
    this.left = false
    this.right = false
    this.up = false
    this.down = false
    this.g = false

    document.onkeydown = (e) => {
      if (e.code === "KeyA" || e.code === "ArrowLeft") this.left = true
      if (e.code === "KeyD" || e.code === "ArrowRight") this.right = true
      if (e.code === "KeyW" || e.code === "ArrowUp") this.up = true
      if (e.code === "KeyS" || e.code === "ArrowDown") this.down = true
      if (e.code === "KeyG") this.g = true
    }
    document.onkeyup = (e) => {
      if (e.code === "KeyA" || e.code === "ArrowLeft") this.left = false
      if (e.code === "KeyD" || e.code === "ArrowRight") this.right = false
      if (e.code === "KeyW" || e.code === "ArrowUp") this.up = false
      if (e.code === "KeyS" || e.code === "ArrowDown") this.down = false
      if (e.code === "KeyG") this.g = false
    }
  }

  pressOnce(key: string, callback: () => void) {
    const func = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback()
        document.removeEventListener("keypress", func)
      }
    }
    document.addEventListener("keypress", func)
  }
}
