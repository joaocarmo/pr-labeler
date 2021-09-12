import nock from 'nock'
import { Probot, ProbotOctokit } from 'probot'
import * as fs from 'fs'
import * as path from 'path'
import prLabeler from '../src'
import { HOOK_NAME_PR } from '../src/constants'
import prOpenedPayload from './fixtures/pull_request.opened.json'
import repoLabels from './fixtures/repo.labels.json'

const route = require('nock-knock/lib').default

const privateKey = fs.readFileSync(
  path.join(__dirname, 'fixtures/mock-cert.pem'),
  'utf-8',
)

const configFile = fs.readFileSync(
  path.join(__dirname, 'fixtures/mock-config.yml'),
  'utf-8',
)

describe('PR Labeler', () => {
  let probot: any

  beforeEach(() => {
    nock.disableNetConnect()

    nock('https://api.github.com')
      // Test that we correctly return a test token
      .post('/app/installations/1/access_tokens')
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

  test('adds labels when a pr is opened (no config)', async () => {
    const mock = nock('https://api.github.com')
      // Test with no config
      .get(route(`/repos/:owner/:repo/contents/:path`))
      .reply(404)
      .get(route(`/repos/:owner/.github/contents/:path`))
      .reply(404)

    // Receive a webhook event
    await probot.receive({ name: HOOK_NAME_PR, payload: prOpenedPayload })

    expect(mock.pendingMocks()).toStrictEqual([])
  })

  test('adds labels when a pr is opened (with config)', async () => {
    const mock = nock('https://api.github.com')
      // Test with no config
      .get(route(`/repos/:owner/:repo/contents/:path`))
      .reply(200, configFile)
      // Test that we return the correct repo labels
      .get(route('/repos/:owner/:repo/labels'))
      .reply(200, repoLabels)
      // Test that we correctly create the correct labels
      .post(route('/repos/:owner/:repo/labels'), (body: any) => {
        expect(body.name).toBe('feature')
        return true
      })
      .reply(200, {})
      // Test that we correctly update the correct labels
      .post(
        route('/repos/:owner/:repo/issues/:issue_number/labels'),
        (body: any) => {
          expect(Array.isArray(body.labels)).toBe(true)
          expect(body.labels.length).toBe(1)
          expect(body.labels).toStrictEqual(['feature'])
          return true
        },
      )
      .reply(200, {})

    // Receive a webhook event
    await probot.receive({ name: HOOK_NAME_PR, payload: prOpenedPayload })

    expect(mock.pendingMocks()).toStrictEqual([])
  })
})
