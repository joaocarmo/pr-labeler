import type { Context } from 'probot'
import type { OctokitResponse } from '@octokit/types'
import { parseBodyForTags } from './utils'

type Label = {
  id: number
  node_id: string
  url: string
  name: string
  description: string | null
  color: string
  default: boolean
}

type LabelResponse = OctokitResponse<Label, 201>

/**
 * @async
 * @param {import('probot').Context} context
 */
const prLabeler = async (
  context: Context<'pull_request.opened'> | Context<'pull_request.edited'>,
) => {
  const prBody = context.payload.pull_request.body ?? ''

  const labelsOnBody = parseBodyForTags(prBody)

  /*
  if (!labelsOnBody.length) {
    // No labels on the body, so we don't need to do anything
    return
  }
  */

  // Check if we need to create new labels
  const existingsLabels = await context.octokit.issues.listLabelsForRepo()
  const existingsLabelsMap = existingsLabels.data.map(({ name }: Label) => name)

  const newLabels = labelsOnBody.filter(
    (label) => !existingsLabelsMap.includes(label),
  )

  // Create new labels, if they don't exist yet
  const requestsToCreateLabel: Promise<LabelResponse>[] = []

  for (const name of newLabels) {
    requestsToCreateLabel.push(
      context.octokit.issues.createLabel(context.repo({ name })),
    )
  }

  try {
    await Promise.all(requestsToCreateLabel)
  } catch (error) {
    // Something went wrong, but it's not blocking
    context.log.error(`${error}`)
  }

  // Add the labels to the PR
  await context.octokit.issues.addLabels(
    context.issue({ labels: labelsOnBody }),
  )
}

export default prLabeler
