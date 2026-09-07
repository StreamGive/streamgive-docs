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

## Versioning

Docusaurus's versioning is set up but not yet used — there's only ever
been one release, so there's nothing to freeze a snapshot of yet. Cut a
version once these docs would otherwise need to diverge for two audiences
at once — the clearest trigger is a mainnet deployment, where "current"
docs start describing mainnet but testnet-era docs are still worth
keeping around:

```
npm run version 1.0.0
```

This snapshots everything currently in `docs/` into `versioned_docs/` and
`versioned_sidebars/`, and adds `1.0.0` to `versions.json`. From then on,
`docs/` is always "next" (unreleased/in-progress) documentation, and the
versioned snapshot is what most readers see by default.

## Related repositories

- [streamgive-contracts](https://github.com/streamgive/streamgive-contracts) — Soroban smart contracts
- [streamgive-backend](https://github.com/streamgive/streamgive-backend) — indexer & API
- [streamgive-frontend](https://github.com/streamgive/streamgive-frontend) — donor & NGO web app

## Status

Early development.

## License

Apache-2.0 — see [LICENSE](./LICENSE).
