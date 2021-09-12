import { defaultConfig } from './config'
import type { Config } from './config'

const parseBodyForTags = (
  body: string,
  { caseSensitive, customLabels }: Config = defaultConfig,
): string[] =>
  customLabels
    .filter(({ text }) =>
      caseSensitive
        ? body.includes(text)
        : body.toLowerCase().includes(text.toLowerCase()),
    )
    .map(({ label }) => label)

export { parseBodyForTags }
