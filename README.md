<p align="center">
	<img src="https://raw.githubusercontent.com/joaocarmo/pr-labeler/master/assets/pr-labeler.svg?sanitize=true" width="256px" alt="pr-labeler">
</p>

# pr-labeler

![tests](https://github.com/joaocarmo/pr-labeler/workflows/Tests/badge.svg)

A GitHub App built with [Probot](https://github.com/probot/probot) that A GitHub
bot to label PRs automatically based on title and body against list of defined
labels.

## Config

Add a `pr-labeler.yml` configuration file to your repository's `.github`
directory with the following content:

```yaml
# .github/pr-labeler.yml
# Treats the text and labels as case sensitive [default: true]
caseSensitive: true
# Array of labels to be applied to the PR [default: []]
# Finds the `text` within the PR title and body and applies the `label`
customLabels:
  - text: '#bug'
    label: 'bug'
  - text: '#test'
    label: 'test'
  - text: '#feature'
    label: 'feature'
```

## Development

### Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

### Docker

```sh
# 1. Build container
docker build -t pr-labeler .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> pr-labeler
```

### Contributing

If you have suggestions for how pr-labeler could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2021 João Carmo
