import { parseBodyForTags } from '../src/utils'
import { defaultConfig } from '../src/config'

describe('parseBodyForTags', () => {
  it('should return an empty array if no tags are found', () => {
    const body = 'This is a test'
    const tags = parseBodyForTags(body)
    expect(tags).toEqual([])
  })

  it('should return an array of tags if tags are found in simple text (case sensitive)', () => {
    const body = 'This is a test with tag1, tag2, and tag3'
    const customLabels = [
      {
        text: 'tag1',
        label: 'tag1',
      },
      {
        text: 'tag2',
        label: 'tag2',
      },
      {
        text: 'tag3',
        label: 'differentName',
      },
    ]
    const config = { ...defaultConfig, caseSensitive: true, customLabels }
    const tags = parseBodyForTags(body, config)
    expect(tags).toEqual(['tag1', 'tag2', 'differentName'])
  })

  it('should return an array of tags if tags are found in simple text (case insensitive)', () => {
    const body = 'This is a test with TAG1, TAG2, and TAG3'
    const customLabels = [
      {
        text: 'tag1',
        label: 'tag1',
      },
      {
        text: 'tag2',
        label: 'tag2',
      },
      {
        text: 'tag3',
        label: 'differentName',
      },
    ]
    const config = { ...defaultConfig, caseSensitive: false, customLabels }
    const tags = parseBodyForTags(body, config)
    expect(tags).toEqual(['tag1', 'tag2', 'differentName'])
  })

  it('should return an array of tags if tags are found in advanced text', () => {
    const body = `\
### Request type

<!-- (add an \`x\` to \`[ ]\` if applicable) -->

- [x] Feature
- [x] Bug Fix
- [x] Tests
- [ ] Refactoring
- [ ] Documentation
- [ ] Release

### Summary

<!-- Provide a brief explanation, try to answer the questions: Why? What? -->

{Please write here what's the main purpose of this PR}
`
    const customLabels = [
      {
        text: '- [x] Feature',
        label: 'feature',
      },
      {
        text: '- [x] Bug Fix',
        label: 'bug',
      },
      {
        text: '- [x] Tests',
        label: 'test',
      },
    ]
    const config = { ...defaultConfig, customLabels }
    const tags = parseBodyForTags(body, config)
    expect(tags).toEqual(['feature', 'bug', 'test'])
  })
})
