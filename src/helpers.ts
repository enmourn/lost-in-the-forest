export function checkCirclesIntersection(
  c1: { x: number; y: number; r: number },
  c2: { x: number; y: number; r: number }
) {
  return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)) <= c1.r + c2.r
}

export function getRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function getRandom(min: number, max: number) {
  return (max - min) * Math.random() + min
}
