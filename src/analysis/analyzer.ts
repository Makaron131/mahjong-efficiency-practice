import MajiangAI from '@kobalab/majiang-ai'
import Majiang from '@kobalab/majiang-core'
import type { AnalyzeInput, AnalyzeOutput, DiscardEval } from './types'

type BaseInfo = {
  paistr: string
  zhuangfeng: number
  menfeng: number
  baopai: string[]
  hongpai: boolean
  xun: number
}

function normalizeInput(input: AnalyzeInput) {
  let paistr = input.paistr
  const zhuangfeng = input.zhuangfeng ?? 0
  const menfeng = input.menfeng ?? 0
  const xun = input.xun ?? 7
  let baopai = (input.baopai ?? []).filter((p) => Majiang.Shoupai.valid_pai(p))
  const hongpai = input.hongpai ?? true
  let heinfo = input.heinfo ?? null

  if (!baopai.length) baopai = ['z2']

  if (!hongpai) {
    paistr = paistr.replace(/0/g, '5')
    baopai = baopai.map((p) => p.replace(/0/g, '5'))
    if (heinfo) heinfo = heinfo.map((h) => h.replace(/0/g, '5'))
  }

  return {
    paistr,
    zhuangfeng,
    menfeng,
    xun,
    baopai,
    hongpai,
    heinfo,
  }
}

function buildBaseInfo(input: ReturnType<typeof normalizeInput>): BaseInfo {
  return {
    paistr: input.paistr,
    zhuangfeng: input.zhuangfeng,
    menfeng: input.menfeng,
    baopai: [...input.baopai],
    hongpai: input.hongpai,
    xun: input.xun,
  }
}

function computeDiscardEvals(ai: any): DiscardEval[] {
  const results: DiscardEval[] = []
  const shoupai = ai.shoupai
  const paishu = ai._suanpai.get_paishu()

  for (const p of shoupai.get_dapai()) {
    const after = shoupai.clone().dapai(p)
    const xiangting = Majiang.Util.xiangting(after)
    const tingpai = Majiang.Util.tingpai(after)
    const n_tingpai = tingpai
      .map((tp: string) => ai._suanpai._paishu[tp[0]][tp[1]])
      .reduce((x: number, y: number) => x + y, 0)
    const ev = ai.eval_shoupai(after, paishu)
    results.push({
      discard: p,
      xiangting,
      tingpai,
      n_tingpai,
      ev: Number.isFinite(ev) ? ev : null,
    })
  }

  results.sort((a, b) => {
    if (a.ev == null && b.ev == null) return 0
    if (a.ev == null) return 1
    if (b.ev == null) return -1
    return b.ev - a.ev
  })

  return results
}

export function analyzeEfficiency(input: AnalyzeInput): AnalyzeOutput {
  const normalized = normalizeInput(input)
  const baseinfo = buildBaseInfo(normalized)
  const ai = new MajiangAI()

  if (normalized.heinfo) {
    MajiangAI.minipaipu(ai, baseinfo, normalized.heinfo, true)
  } else {
    MajiangAI.minipaipu(ai, baseinfo)
  }

  const results = computeDiscardEvals(ai)

  return {
    normalized: {
      paistr: normalized.paistr,
      baopai: normalized.baopai,
      hongpai: normalized.hongpai,
      xun: normalized.xun,
    },
    results,
  }
}
