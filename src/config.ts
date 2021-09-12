export type CustomLabel = {
  text: string
  label: string
}

export type Config = {
  caseSensitive: boolean
  customLabels: CustomLabel[]
}

export const defaultConfig: Config = {
  caseSensitive: true,
  customLabels: [],
}
