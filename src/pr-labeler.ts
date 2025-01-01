import type { Context } from 'probot'
import type { OctokitResponse } from '@octokit/types'
import { getConfig, parseBodyForTags } from './utils'

interface Label {
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
  const config = await getConfig(context)

  const prTitle = context.payload.pull_request.title
  const prBody = context.payload.pull_request.body ?? ''

  const labelsOnTitle = config.searchTitle
    ? parseBodyForTags(prTitle, config)
    : []
  const labelsOnBody = config.searchBody ? parseBodyForTags(prBody, config) : []

  // Aggregates all labels to be added to the PR and removes duplicates
  const labelsOnPR = Array.from(new Set([...labelsOnTitle, ...labelsOnBody]))

  if (!labelsOnPR.length) {
    // No labels on the body, so we don't need to do anything
    return
  }

  // Check if we need to create new labels
  // @ts-expect-error - Seems to be a recurring issue with Probot https://github.com/probot/probot/issues?q=Expression+produces+a+union+type+that+is+too+complex+to+represent.
  const repo = context.repo()
  const existingsLabels = await context.octokit.issues.listLabelsForRepo(repo)
  const existingsLabelsMap = existingsLabels.data.map(({ name }: Label) => name)

  const newLabels = labelsOnPR.filter(
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

  // Add/replace the labels to the PR
  if (config.alwaysReplace) {
    await context.octokit.issues.setLabels(
      context.issue({ labels: labelsOnPR }),
    )
  } else {
    await context.octokit.issues.addLabels(
      context.issue({ labels: labelsOnPR }),
    )
  }
}

export default prLabeler
