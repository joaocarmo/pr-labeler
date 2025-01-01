export interface CustomLabel {
  text: string
  label: string
}

export interface Config {
  alwaysReplace: boolean
  caseSensitive: boolean
  customLabels: CustomLabel[]
  searchBody: boolean
  searchTitle: boolean
  wholeWords: boolean
}

export const defaultConfig: Config = {
  alwaysReplace: false,
  caseSensitive: true,
  customLabels: [],
  searchBody: true,
  searchTitle: true,
  wholeWords: false,
}
