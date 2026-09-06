# StreamGive — Docs

Documentation site for StreamGive, a recurring/streaming donation platform
for verified NGOs on Stellar. Built with [Docusaurus](https://docusaurus.io/).

## Local development

```
npm install
npm start
```

## Build

```
npm run build
```

Deploys automatically to GitHub Pages on every push to `main` (see
`.github/workflows/deploy.yml`) — but only once, one time, someone enables
it in the repo: **Settings → Pages → Source → GitHub Actions**. The
workflow won't publish anything until that's set.

## Related repositories

- [streamgive-contracts](https://github.com/streamgive/streamgive-contracts) — Soroban smart contracts
- [streamgive-backend](https://github.com/streamgive/streamgive-backend) — indexer & API
- [streamgive-frontend](https://github.com/streamgive/streamgive-frontend) — donor & NGO web app

## Status

Early development.

## License

Apache-2.0 — see [LICENSE](./LICENSE).
