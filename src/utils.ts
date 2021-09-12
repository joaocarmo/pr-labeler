import { defaultConfig } from './config'
import type { Config } from './config'

const parseBodyForTags = (
  body: string,
  config: Config = defaultConfig,
): string[] => {
  console.log(body, config)

  return []
}

export { parseBodyForTags }
