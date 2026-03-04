import { describe, expect, it } from 'vitest'
import Majiang from '@kobalab/majiang-core'
import { analyzeEfficiency } from '../analyzer'

describe('analyzeEfficiency', () => {
  it('normalizes defaults (baopai/xun)', () => {
    const out = analyzeEfficiency({
      paistr: 'm123p1234789s338s8',
    })

    expect(out.normalized.baopai).toEqual(['z2'])
    expect(out.normalized.xun).toBe(7)
  })

  it('replaces red fives when hongpai is false', () => {
    const out = analyzeEfficiency({
      paistr: 'm123405p123s338s88',
      baopai: ['m0', 's3'],
      hongpai: false,
    })

    expect(out.normalized.paistr).not.toMatch(/0/)
    expect(out.normalized.baopai.join('')).not.toMatch(/0/)
  })

  it('produces a result for every valid discard', () => {
    const out = analyzeEfficiency({
      paistr: 'm123p1234789s338s8',
      baopai: ['s3'],
      hongpai: true,
    })

    const shoupai = Majiang.Shoupai.fromString(out.normalized.paistr)
    const dapai = shoupai.get_dapai()

    expect(out.results.length).toBe(dapai.length)
    const set = new Set(dapai)
    for (const row of out.results) {
      expect(set.has(row.discard)).toBe(true)
    }
  })

  it('sorts results by ev descending (ignoring nulls)', () => {
    const out = analyzeEfficiency({
      paistr: 'm123p1234789s338s8',
      baopai: ['s3'],
      hongpai: true,
    })

    const evs = out.results.map((r) => r.ev ?? Number.NEGATIVE_INFINITY)
    for (let i = 1; i < evs.length; i += 1) {
      expect(evs[i - 1]).toBeGreaterThanOrEqual(evs[i])
    }
  })

  it('reports best discards and their tingpai after discard', () => {
    const out = analyzeEfficiency({
      paistr: 'm123p123789s338s88',
      baopai: ['s3'],
      hongpai: true,
      xun: 5,
    })

    const maxEv = out.results.reduce((max, r) => {
      if (r.ev == null) return max
      return r.ev > max ? r.ev : max
    }, Number.NEGATIVE_INFINITY)

    const best = out.results.filter((r) => r.ev === maxEv)
    expect(best.length).toBeGreaterThan(0)

    for (const row of best) {
      const base = Majiang.Shoupai.fromString(out.normalized.paistr)
      const after = base.clone().dapai(row.discard)
      const expectedTingpai = Majiang.Util.tingpai(after)
      expect(row.tingpai).toEqual(expectedTingpai)
    }
  })
})
