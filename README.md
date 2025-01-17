<p align="center">
	<img src="https://raw.githubusercontent.com/joaocarmo/pr-labeler/master/assets/pr-labeler.svg?sanitize=true" width="256px" alt="pr-labeler">
</p>

# PR Labeler

![tests](https://github.com/joaocarmo/pr-labeler/workflows/Tests/badge.svg)
![ql](https://github.com/joaocarmo/pr-labeler/workflows/CodeQL/badge.svg)

A GitHub App built with [Probot](https://github.com/probot/probot) that enables
a GitHub bot to label PRs automatically based on title and body against a list
of defined labels.

## Config

Add a `pr-labeler.yml` configuration file to your repository's `.github`
directory with the following content:

```yaml
# .github/pr-labeler.yml
# The bot always updates the labels, add/remove as necessary [default: false]
alwaysReplace: false
# Treats the text and labels as case sensitive [default: true]
caseSensitive: true
# Array of labels to be applied to the PR [default: []]
customLabels:
  # Finds the `text` within the PR title and body and applies the `label`
  - text: '#bug'
    label: 'bug'
  - text: '#test'
    label: 'test'
  - text: '#feature'
    label: 'feature'
# Search the body of the PR for the `text` [default: true]
searchBody: true
# Search the title of the PR for the `text` [default: true]
searchTitle: true
# Search for whole words only [default: false]
wholeWords: false
```

## Development

If you want to work on the bot, you can follow the instructions below.

### Setup

```sh
# Install dependencies
pnpm install

# Build the bot (we need to transpile TypeScript into JavaScript)
pnpm build

# Run the bot
pnpm start
```

### Docker

```sh
# 1. Build container
docker build -t pr-labeler .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> pr-labeler
```

### Deployment

A few environment variables need to be set in order to deploy the bot:

```sh
# The APP_ID and PRIVATE_KEY are required to authenticate the GitHub App
export APP_ID=<app-id>
export PRIVATE_KEY=<pem-value>
# Alternatively, you can set the PRIVATE_KEY_PATH to the path of the private key
# export PRIVATE_KEY_PATH=<path-to-pem-file>

# The WEBHOOK_SECRET is used to verify incoming webhooks from GitHub
export WEBHOOK_SECRET=<webhook-secret>
```

### Contributing

If you have suggestions for how pr-labeler could be improved, or want to report
a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2021 João Carmo
