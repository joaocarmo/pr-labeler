import { Probot } from 'probot'
import prLabeler from './pr-labeler'
import { PR_EDITED, PR_OPENED } from './constants'

export = (app: Probot) => {
  app.on([PR_EDITED, PR_OPENED], prLabeler)
}
