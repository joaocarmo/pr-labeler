import nock from 'nock'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Probot, ProbotOctokit } from 'probot'
import prLabeler from '../src'
import { HOOK_NAME_PR } from '../src/constants'
import prEditedPayload from './fixtures/pull_request.edited.json'
import prOpenedPayload from './fixtures/pull_request.opened.json'
import repoLabels from './fixtures/repo.labels.json'

const route = require('nock-knock/lib').default

// Get config files
const privateKey = readFileSync(
  join(__dirname, 'fixtures', 'mock-cert.pem'),
  'utf-8',
)
const configFile = readFileSync(
  join(__dirname, 'fixtures', 'mock-config.yml'),
  'utf-8',
)

describe('PR Labeler', () => {
  let probot: any

  const testCases = [
    ['opened', prOpenedPayload, 'feature'],
    ['edited', prEditedPayload, 'wip'],
  ]

  beforeEach(() => {
    nock.disableNetConnect()

    nock('https://api.github.com')
      // Test that we correctly return a test token
      .post(route('/app/installations/:installation_id/access_tokens'))
      .reply(200, {
        token: 'test-token',
      })

    probot = new Probot({
      appId: 42,
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

  afterAll(nock.restore)

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  test.each(testCases)(
    'Adds no labels when a PR is %s (no config)',
    async (action, payload) => {
      const mock = nock('https://api.github.com')
        // Test with no config
        .get(route(`/repos/:owner/:repo/contents/:path`))
        .reply(404)
        .get(route(`/repos/:owner/.github/contents/:path`))
        .reply(404)

      // Make sure the payload is correct
      expect((payload as any).action).toBe(action)

      // Receive a webhook event
      await probot.receive({ name: HOOK_NAME_PR, payload })

      expect(mock.pendingMocks()).toStrictEqual([])
    },
  )

  test.each(testCases)(
    'Adds one label when a PR is %s (with config)',
    async (action, payload, label) => {
      const mock = nock('https://api.github.com')
        // Test with no config
        .get(route(`/repos/:owner/:repo/contents/:path`))
        .reply(200, configFile)
        // Test that we return the correct repo labels
        .get(route('/repos/:owner/:repo/labels'))
        .reply(200, repoLabels)
        // Test that we correctly create the correct labels
        .post(route('/repos/:owner/:repo/labels'), (body: any) => {
          expect(body.name).toBe(label)
          return true
        })
        .reply(200, {})
        // Test that we correctly update the correct labels
        .post(
          route('/repos/:owner/:repo/issues/:issue_number/labels'),
          (body: any) => {
            expect(Array.isArray(body.labels)).toBe(true)
            expect(body.labels.length).toBe(1)
            expect(body.labels).toStrictEqual([label])
            return true
          },
        )
        .reply(200, {})

      // Make sure the payload is correct
      expect((payload as any).action).toBe(action)

      // Receive a webhook event
      await probot.receive({ name: HOOK_NAME_PR, payload })

      expect(mock.pendingMocks()).toStrictEqual([])
    },
  )
})
