import type { Context } from 'probot'
import type { OctokitResponse } from '@octokit/types'

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

const prLabeler = async (
  context: Context<'pull_request.opened'> | Context<'pull_request.edited'>,
) => {
  const prBody = context.payload.pull_request.body
  console.log(prBody)

  const labelsOnBody: string[] = []

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
      context.octokit.issues.createLabel({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name,
      }),
    )
  }

  await Promise.all(requestsToCreateLabel)

  // Add the labels to the PR
  await context.octokit.issues.addLabels({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    issue_number: context.payload.pull_request.number,
    labels: labelsOnBody,
  })
}

export default prLabeler
