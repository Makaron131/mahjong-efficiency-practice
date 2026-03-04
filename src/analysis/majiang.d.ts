declare module '@kobalab/majiang-core' {
  const Majiang: any
  export default Majiang
}

declare module '@kobalab/majiang-ai' {
  const MajiangAI: any & { minipaipu: (...args: any[]) => any }
  export default MajiangAI
}
