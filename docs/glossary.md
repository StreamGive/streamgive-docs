---
sidebar_position: 13
---

# Glossary

## Stellar and Soroban

**Stellar** — the blockchain network StreamGive runs on.

**Soroban** — Stellar's smart contract platform. StreamGive's contracts
are Soroban contracts, written in Rust.

**Lumens (XLM)** — Stellar's native asset. One of the token choices when
starting a stream.

**Stellar Asset Contract (SAC)** — the standard contract interface every
asset on Stellar exposes to Soroban, native XLM included. It's why "every
token uses 7 decimal places" is true universally rather than per-asset.

**Testnet / Mainnet** — testnet is Stellar's free, reset-able test
network (funded via a public faucet, no real value); mainnet (sometimes
called the "public network") is the real one. Everything in this
documentation defaults to testnet.

**G-address / C-address** — Stellar addresses starting with `G` identify
accounts (wallets); addresses starting with `C` identify contracts. A
donor or NGO's identity is a G-address; `ngo-registry` and
`donation-vault` are each a C-address.

**SEP** — a Stellar Ecosystem Proposal, the mechanism Stellar uses to
standardize cross-wallet, cross-app behavior. StreamGive relies on two:
[SEP-43](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md)
(a standard wallet interface — what lets any SEP-43-compatible wallet plug
into the same connect/sign flow) and
[SEP-53](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md)
(signing arbitrary messages, not just transactions — what the backend's
admin authentication is built on).

**Freighter** — the most common Stellar browser wallet extension.

**Stellar Wallets Kit** — the library the frontend uses to talk to
Freighter and other SEP-43-compatible wallets through one interface,
rather than integrating each wallet separately.

## StreamGive-specific

**Stream** — a single donor-to-NGO streaming donation, held by
`donation-vault`. Has a token, a rate, a balance, and a running total
withdrawn.

**Rate** — how much of a stream's balance unlocks to the NGO per second.
Donors don't set this directly; the app derives it from a total amount
and a chosen duration.

**Accrue / accrued** — the portion of a stream's balance that has
"unlocked" (become available to the NGO) since the last checkpoint, based
on the rate and elapsed time. Accrued funds aren't paid out automatically —
the NGO has to call `withdraw`.

**Settle / settlement** — the act of paying out whatever has accrued
before some other change happens (a top-up, a rate change, a
cancellation). Every stream-mutating action settles first, specifically
so changing the terms of a stream never gains or loses anyone funds
they'd already earned or hadn't yet.

**Checkpoint** — the timestamp (`last_update`) a stream's accrual is
calculated from. Every settlement moves this forward to "now."

**Escrow** — the general pattern `donation-vault` implements: funds are
held by a contract rather than sent directly, and released according to
rules the contract enforces rather than by manual transfer.

**Verified NGO** — an address `ngo-registry` has marked `verified: true`
via `approve_ngo`. Only verified NGOs appear in the app's explorer; the
vault contract itself doesn't care whether an NGO is verified.

**Indexer** — the backend process that watches the contracts' events and
mirrors them into a queryable database. Never a source of truth, only a
read-optimized copy of it.

**"Admin" — which one?** Three different things share this name, and
they don't have to be the same address:

- `ngo-registry`'s admin, set via that contract's own `init`, who can
  call `approve_ngo`.
- `donation-vault`'s admin, set via *its* `init`, who can `pause`,
  `set_treasury`, and `set_fee_bps`.
- The backend's `ADMIN_ADDRESS`, which gates the platform admin API
  routes and the frontend's `/platform-admin` panel.

In a typical deployment these are all the same person's address for
simplicity, but nothing enforces that — see [Deploying the contracts](./deploying-contracts.md).
