import color from "./color"

const config = {
  viewport: { w: 1300, h: 654 },
  map: {
    w: 40000,
    h: 40000,
    ground: {
      color: color.grayLight,
    },
    trees: {
      density: 0.00019,
      size: { min: 10, max: 50 },
      color: color.green,
    },
  },
  player: {
    size: 10,
    speeds: [1.5, 1.3, 1.1],
    lives: [60 * 60 * 15, 60 * 60 * 8, 60 * 60 * 4],
    color: color.blackLight,
  },
  gps: {
    margin: 20,
    color: {
      overlay: "#000000cc",
      bg: color.blackLight,
      way: color.red,
      oldWay: color.black,
    },
  },
  liveScale: {
    color: {
      border: color.redLight,
      body: color.red,
    },
  },
  alert: {
    color: {
      overlay: "#000000cc",
      body: color.black,
    },
    font: {
      color: color.grayLight,
    },
  },
  fps: 60,
}

export default config
