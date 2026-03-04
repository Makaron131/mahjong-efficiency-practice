const SUITS = ['m', 'p', 's', 'z'] as const

function buildPaistrFromTiles(tiles: string[]) {
  const grouped: Record<string, number[]> = { m: [], p: [], s: [], z: [] }
  for (const t of tiles) {
    grouped[t[0]].push(Number(t[1]))
  }
  let out = ''
  for (const suit of SUITS) {
    const nums = grouped[suit].sort((a, b) => a - b)
    if (!nums.length) continue
    out += suit + nums.join('')
  }
  return out
}

export function randomHand() {
  const tiles: string[] = []
  for (const s of ['m', 'p', 's']) {
    for (let n = 1; n <= 9; n += 1) {
      for (let i = 0; i < 4; i += 1) tiles.push(`${s}${n}`)
    }
  }
  for (let n = 1; n <= 7; n += 1) {
    for (let i = 0; i < 4; i += 1) tiles.push(`z${n}`)
  }

  const pick: string[] = []
  for (let i = 0; i < 14; i += 1) {
    const idx = Math.floor(Math.random() * tiles.length)
    pick.push(tiles.splice(idx, 1)[0])
  }
  return buildPaistrFromTiles(pick)
}
