---
sidebar_position: 8
---

# Donor guide

## 1. Connect a wallet

Any wallet [Stellar Wallets Kit](https://stellarwalletskit.dev/) supports —
Freighter is the most common. Click **Connect Wallet** in the top nav.

## 2. Find an NGO

Browse `/ngos` for verified organizations, or open one directly from a
donate widget embedded on the NGO's own site. Only verified NGOs show up
here — that's the platform's curation layer, not something enforced by the
contract itself.

## 3. Start a stream

From an NGO's profile, **Start streaming** opens the donation form:

- **Token** — native XLM, or paste a custom asset's contract address.
- **Total amount** — how much you're depositing in total.
- **Stream over** — a duration (a week, a month, three months, a year).

You don't set a rate directly — the form works out a constant per-second
rate from your amount and duration and shows you what that comes out to.
If the amount is too small to produce a meaningful rate over the duration
you picked (a tiny amount over a year, say), the form tells you rather
than silently accepting a rate that rounds down to zero.

**Review & Sign** builds the transaction and asks your wallet to sign it.
Once confirmed, the NGO's balance starts accruing immediately, on-chain.

## 4. Manage your streams

`/dashboard` lists every stream you've started, with your totals across
all of them. Each active stream has:

- **Modify rate** — re-rates the stream's *remaining* balance over a
  newly chosen duration. This doesn't add funds; it changes how fast the
  balance you already committed streams out. Whatever had already accrued
  to the NGO under the old rate is settled to them first, so changing your
  mind never claws back funds they've already earned.
- **Cancel** — stops the stream for good. Whatever has accrued to the NGO
  up to that moment is settled to them; whatever's left comes back to you
  immediately.
- **Top up** (adding more funds to an existing stream without changing its
  rate) is on the contract already but not wired up in the app yet —
  today, starting a new stream is the way to give more to the same NGO.

Both actions confirm on-chain right away, but the numbers on this page
come from an indexer that polls on an interval — a just-confirmed change
can take a few seconds to show up here. If it's been longer than that,
something's actually wrong; otherwise, it's just catching up.
