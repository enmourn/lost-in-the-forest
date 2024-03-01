export default class Keyboard {
  a: boolean = false
  w: boolean = false
  s: boolean = false
  d: boolean = false
  arrowLeft: boolean = false
  arrowUp: boolean = false
  arrowRight: boolean = false
  arrowDown: boolean = false
  q: boolean = false
  e: boolean = false
  g: boolean = false

  left: boolean = false
  up: boolean = false
  right: boolean = false
  down: boolean = false

  constructor() {
    document.onkeydown = (e) => {
      if (e.code === "KeyA") this.a = true
      if (e.code === "KeyW") this.w = true
      if (e.code === "KeyS") this.s = true
      if (e.code === "KeyD") this.d = true
      if (e.code === "ArrowLeft") this.arrowLeft = true
      if (e.code === "ArrowUp") this.arrowUp = true
      if (e.code === "ArrowDown") this.arrowDown = true
      if (e.code === "ArrowRight") this.arrowRight = true
      if (e.code === "KeyQ") this.q = true
      if (e.code === "KeyE") this.e = true
      if (e.code === "KeyG") this.g = true
      this.updDirection()
    }
    document.onkeyup = (e) => {
      if (e.code === "KeyA") this.a = false
      if (e.code === "KeyW") this.w = false
      if (e.code === "KeyS") this.s = false
      if (e.code === "KeyD") this.d = false
      if (e.code === "ArrowLeft") this.arrowLeft = false
      if (e.code === "ArrowUp") this.arrowUp = false
      if (e.code === "ArrowDown") this.arrowDown = false
      if (e.code === "ArrowRight") this.arrowRight = false
      if (e.code === "KeyQ") this.q = false
      if (e.code === "KeyE") this.e = false
      if (e.code === "KeyG") this.g = false
      this.updDirection()
    }
  }

  private updDirection() {
    this.left = this.a || this.arrowLeft || this.q
    this.up = this.w || this.arrowUp || this.q || this.e
    this.down = this.s || this.arrowDown
    this.right = this.d || this.arrowRight || this.e
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
