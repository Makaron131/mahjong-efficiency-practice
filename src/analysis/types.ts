export type AnalyzeInput = {
  paistr: string
  zhuangfeng?: number
  menfeng?: number
  baopai?: string[]
  hongpai?: boolean
  xun?: number
  heinfo?: string[] | null
}

export type DiscardEval = {
  discard: string
  xiangting: number
  tingpai: string[]
  n_tingpai: number
  ev: number | null
}

export type AnalyzeOutput = {
  normalized: {
    paistr: string
    baopai: string[]
    hongpai: boolean
    xun: number
  }
  results: DiscardEval[]
}
