export type CustomLabel = {
  text: string
  label: string
}

export type Config = {
  alwaysReplace: boolean
  caseSensitive: boolean
  customLabels: CustomLabel[]
  searchBody: boolean
  searchTitle: boolean
}

export const defaultConfig: Config = {
  alwaysReplace: false,
  caseSensitive: true,
  customLabels: [],
  searchBody: true,
  searchTitle: true,
}
