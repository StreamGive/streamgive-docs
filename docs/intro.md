---
slug: /
sidebar_position: 1
---

# What is StreamGive?

StreamGive is an open-source donation platform on [Stellar](https://stellar.org)
that lets donors support verified NGOs with **continuous, streaming
donations** instead of one-off transactions.

A donor picks an NGO, deposits an amount, and sets how long it should
stream over. From that point on, the NGO's balance grows second by
second — no manual disbursement, no waiting for a milestone review. The
donor can top up, change the rate, or cancel at any time; whatever hasn't
streamed yet comes straight back to them.

## The problem

Most on-chain giving today is a one-off transaction: you send funds once,
and the NGO gets a lump sum immediately, whether or not there's a plan in
place to use it responsibly yet. Milestone-based crowdfunding (the more
common pattern in the Stellar ecosystem) fixes some of that by gating
releases behind review, but it trades speed for a slow, manual approval
cycle — and donors can't adjust or reclaim funds once a milestone is
approved.

Streaming splits the difference: funds unlock gradually and automatically
under a contract's own rules, and a donor's control over their own money
doesn't end the moment they hit "donate."

## How it works

1. **Connect a wallet** — Freighter or any Stellar Wallets Kit-supported wallet.
2. **Start a stream** — pick a verified NGO, an amount, and a duration; a
   Soroban contract holds the deposit and releases it to the NGO at a
   constant per-second rate.
3. **Stay in control** — top up, change the rate, or cancel whenever. On
   cancel, whatever the NGO has already earned is settled to them, and the
   untouched remainder returns to the donor immediately.
4. **NGOs withdraw** what's accrued to their stream whenever they choose.

Everything — the NGO registry, every stream, every withdrawal — lives
on-chain and is independently verifiable; the backend indexer and frontend
are just a convenient way to read and interact with it.

## Repositories

StreamGive is split across four repos:

- **[streamgive-contracts](https://github.com/streamgive/streamgive-contracts)** — the Soroban smart contracts: an NGO registry and a streaming-donation vault.
- **[streamgive-backend](https://github.com/streamgive/streamgive-backend)** — an indexer that watches the contracts for events, plus the API that serves that data.
- **[streamgive-frontend](https://github.com/streamgive/streamgive-frontend)** — the donor and NGO web app.
- **streamgive-docs** — this site.

More on how these fit together is coming in the next few pages —
architecture, deployment, and contributing guides.
