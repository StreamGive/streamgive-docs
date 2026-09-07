---
sidebar_position: 14
---

# Roadmap and changelog

## Roadmap

Known gaps, roughly in the order they'd matter to someone deploying a
real instance:

- **No external security audit yet.** See [Security and audit status](./security.md).
  This is the top item for a reason.
- **No mainnet deployment.** Everything documented here defaults to
  testnet; going to mainnet is a deliberate manual step for whoever
  operates an instance, not something the project has done itself.
- **The indexer doesn't reconcile `top_up` or `modify_rate` events.**
  Both need either a verified read-only contract call or duplicating the
  contract's accrual math off-chain to compute correctly — real work,
  intentionally deferred rather than guessed at. Only affects the
  dashboard's numbers, never the contracts themselves.
- **Top-up isn't wired into the frontend.** The contract function exists
  and is tested; there's no UI path to call it yet, so donors add more to
  an NGO today by starting a new stream instead.
- **The Freighter-driven end-to-end test is a documented stub, not a
  verified test.** The navigation-only end-to-end tests are real and run
  in CI; the wallet-signing flow needs a real browser and a real
  extension to actually verify, which isn't something CI does today.
- **No real-time push.** The dashboard and impact page poll on an
  interval rather than updating the moment something changes on-chain.

## Changelog

### 0.1.0 — initial release

The first complete pass across all four repos:

- **Contracts** — `ngo-registry` (self-service registration, admin
  approval) and `donation-vault` (create, top up, modify rate, cancel,
  withdraw; pausable; optional capped protocol fee), with unit,
  integration, and accrual-math edge-case tests.
- **Backend** — an event indexer with a durable, per-event checkpoint; a
  REST API for NGOs, streams, and platform impact; NGO application
  intake and SEP-53-signature-gated admin review; rate limiting;
  Docker Compose for local development.
- **Frontend** — wallet connection, NGO discovery, the full donor flow
  (create/modify/cancel a stream), an NGO admin panel with withdrawal and
  an embeddable donate widget, a platform admin panel for NGO approval,
  and a public impact page.
- **Docs** — this site.
