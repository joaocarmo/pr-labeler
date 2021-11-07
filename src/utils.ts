import type { Context } from 'probot'
import escapeStringRegexp from 'escape-string-regexp'
import { defaultConfig } from './config'
import type { Config, CustomLabel } from './config'
import { CONFIG_FILE_NAME } from './constants'

const getConfig = async (
  context: Context<'pull_request.opened'> | Context<'pull_request.edited'>,
): Promise<Config> => {
  let config: Config | null = null

  // Load config from .github/pr-labeler.yml in the repository and combine with default config
  try {
    config = await context.config(CONFIG_FILE_NAME, defaultConfig)
  } catch (error) {
    // Something went wrong, but it's not blocking
    context.log.error(`${error}`)
  }

  if (!config || !(config instanceof Object)) {
    // No config found, use default config
    config = defaultConfig
  }

  if (!Array.isArray(config.customLabels)) {
    config.customLabels = []
  }

  return config
}

const filterFn =
  (body: string, { caseSensitive, wholeWords }: Config = defaultConfig) =>
  ({ text }: CustomLabel) => {
    const escapedText = escapeStringRegexp(text)
    const searchString = wholeWords
      ? `[^0-9A-Za-z_]${escapedText}[^0-9A-Za-z_]`
      : escapedText
    const searchOptions = caseSensitive ? 'g' : 'gi'

    return new RegExp(searchString, searchOptions).test(body)
  }

const parseBodyForTags = (
  body: string,
  { customLabels, ...config }: Config = defaultConfig,
): string[] =>
  customLabels
    .filter(filterFn(body, { customLabels, ...config }))
    .map(({ label }) => label)

export { getConfig, parseBodyForTags }
