export function tileImage(code: string) {
  return `/src/assets/tiles/${code}.gif`
}

export function parsePaistr(paistr: string) {
  const tiles: string[] = []
  let suit = ''
  for (const ch of paistr) {
    if ('mpsz'.includes(ch)) {
      suit = ch
      continue
    }
    if (/\d/.test(ch) && suit) {
      tiles.push(`${suit}${ch}`)
    }
  }
  return tiles
}

export function doraFromIndicator(code: string) {
  if (!code || code.length < 2) return code
  const suit = code[0]
  let num = Number(code[1])
  if (Number.isNaN(num)) return code
  if ('mps'.includes(suit)) {
    if (num === 0) num = 5
    const next = num === 9 ? 1 : num + 1
    return `${suit}${next}`
  }
  if (suit === 'z') {
    if (num >= 1 && num <= 4) {
      return `z${num === 4 ? 1 : num + 1}`
    }
    if (num >= 5 && num <= 7) {
      return `z${num === 7 ? 5 : num + 1}`
    }
  }
  return code
}
