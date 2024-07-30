import * as OpenCC from 'opencc-js'

export const roundToTwo = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const convertToTraditional = (text: string): string => {
  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })
  return converter(text)
}
