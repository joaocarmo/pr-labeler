import { Probot } from 'probot'
import prLabeler from './pr-labeler'
import { PR_EDITED, PR_OPENED } from './constants'

/**
 * @param {import('probot').Probot} app
 */
export = (app: Probot) => {
  app.on([PR_OPENED, PR_EDITED], prLabeler)
}
