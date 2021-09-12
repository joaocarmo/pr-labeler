import type { Context } from 'probot'
import { defaultConfig } from './config'
import type { Config } from './config'
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

export { getConfig, parseBodyForTags }
