---
sidebar_position: 11
---

# Security and audit status

**StreamGive's contracts have not undergone an external audit.** Nothing
on this page is a substitute for one, and no one should deposit
more than they'd accept losing to an unaudited contract. This page exists
to document what protections exist, what's been deliberately left as an
accepted risk, and how to report a problem.

## What's in place

### Contracts

- Every mutating function requires the auth of a specific, named address
  (`require_auth`) — never inferred from who happened to call it.
- All accrual arithmetic uses saturating operations — it can't overflow or
  panic, only cap out at the actual balance.
- `pause` halts new activity (`create_stream`, `withdraw`, `top_up`,
  `modify_rate`) without ever blocking `cancel_stream` — an admin can stop
  new deposits, but can never trap a donor's existing funds in the vault.
- The protocol fee is hard-capped at 10% in the contract itself
  (`set_fee_bps` rejects anything higher) — an admin key compromise can't
  turn it into a de facto fund seizure via an arbitrarily high fee.
- Unit and integration tests cover the happy paths, the documented error
  paths, and — for the accrual math specifically — a grid of edge-case
  inputs (zero rate, near-`i128::MAX` values, zero/one-second elapsed
  time) as a stand-in for full property-based fuzzing.

### Backend and frontend

- The backend never holds funds and never signs a transaction — every
  contract call is built and signed in the donor's or NGO's own browser.
  A compromised backend can serve wrong *data*; it cannot move funds.
- Admin-only backend routes require a [SEP-53](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md)-signed
  request bound to the specific method, path, and a timestamp — a
  captured request can't be replayed against a different endpoint, and is
  only valid for 5 minutes.
- The platform admin panel calls the on-chain `approve_ngo` *before*
  recording the off-chain review decision, specifically so a rejected or
  failed wallet signature can never leave an application marked
  "approved" while the NGO is still unverified on-chain.

## Accepted risks and known gaps

- **Admin key custody is entirely the operator's responsibility.** Both
  contracts' admin address and the backend's `ADMIN_ADDRESS` are
  configuration, not something the protocol itself constrains beyond what's
  described above.
- **`donation-vault` doesn't check `ngo-registry`.** A stream can target
  an unverified address; verification is enforced by the apps, not the
  chain. See [Deploying the contracts](./deploying-contracts.md) for the
  reasoning.
- **The indexer's read model can lag or, for `top_up`/`modify_rate`
  specifically, drift.** Those two events don't carry enough data for the
  indexer to reconstruct the exact resulting balance without either a
  verified contract-read call or duplicating the contract's accrual math
  off-chain — both real work, intentionally not yet done. This is a
  **data-freshness issue in the dashboard only**, not a fund-safety one:
  the contract's own state is never affected by what the indexer does or
  doesn't record.
- **No rate limiting or signature scheme protects the public read
  endpoints** (`/ngos`, `/streams`, `/impact/:ngoId`) beyond the
  platform-wide 100 requests/minute default — they're not meant to be
  privileged.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting on the relevant repo (the
**Security** tab → **Report a vulnerability**) rather than a public issue,
for anything that could put funds or user data at risk. For the contracts
specifically, that's [streamgive-contracts](https://github.com/streamgive/streamgive-contracts).
