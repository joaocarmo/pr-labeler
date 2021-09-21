import { Probot, ApplicationFunctionOptions } from 'probot'
import prLabeler from './pr-labeler'
import useRouter from './router'
import { PR_EDITED, PR_OPENED } from './constants'

/**
 * @param {import('probot').Probot} app
 * @param {import('probot').ApplicationFunctionOptions} options
 */
export = (app: Probot, { getRouter }: ApplicationFunctionOptions) => {
  // Inject our custom routes
  useRouter(getRouter)

  // Listen for events
  app.on([PR_OPENED, PR_EDITED], prLabeler)
}
