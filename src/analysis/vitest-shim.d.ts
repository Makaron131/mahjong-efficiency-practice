declare module 'vitest' {
  export const describe: (name: string, fn: () => void) => void
  export const it: (name: string, fn: () => void) => void
  export const expect: <T>(value: T) => {
    toBe: (expected: T) => void
    toEqual: (expected: T) => void
    toBeGreaterThanOrEqual: (expected: number) => void
    toBeGreaterThan: (expected: number) => void
    not: {
      toMatch: (pattern: RegExp) => void
    }
    toMatch: (pattern: RegExp) => void
  }
}
