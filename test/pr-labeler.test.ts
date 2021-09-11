import nock from 'nock'
import { Probot, ProbotOctokit } from 'probot'
import * as fs from 'fs'
import * as path from 'path'
import prLabeler from '../src'
import { HOOK_NAME_PR } from '../src/constants'
import payload from './fixtures/pull_request.opened.json'

// const issueCreatedBody = { body: 'Thanks for opening this issue!' }

const privateKey = fs.readFileSync(
  path.join(__dirname, 'fixtures/mock-cert.pem'),
  'utf-8',
)

describe('PR Labeler', () => {
  let probot: any

  beforeEach(() => {
    nock.disableNetConnect()
    probot = new Probot({
      appId: 123,
      privateKey,
      // Disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    })
    // Load our app into probot
    probot.load(prLabeler)
  })

  test('adds labels when a pr is opened/edited', async () => {
    const mock = nock('https://api.github.com')
      // Test that we correctly return a test token
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          [HOOK_NAME_PR]: 'write',
        },
      })

      // Test that a PR is created
      .post('/repos/joaocarmo/pr-labeler-test/pulls', (body: any) => {
        expect(body.action).toBe('opened')
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: HOOK_NAME_PR, payload })

    expect(mock.pendingMocks()).toStrictEqual([])
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
