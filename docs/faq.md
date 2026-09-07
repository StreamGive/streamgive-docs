---
sidebar_position: 12
---

# FAQ

### Is StreamGive audited?

No. See [Security and audit status](./security.md) for exactly what
protections do and don't exist.

### What token can I donate in?

Native XLM, or any Soroban token contract address you paste into the
custom-asset field. The amount math assumes 7 decimal places, which is
fixed by the Stellar Asset Contract standard for every asset, not
something per-token to configure.

### Is there a minimum donation?

Not a fixed one, but there's an effective floor: the contract needs
`deposit / duration` (in seconds) to round to at least 1, in the token's
smallest unit. The donation form checks this and tells you if your amount
is too small for the duration you picked, rather than silently accepting
a rate that rounds down to zero.

### What happens if I cancel a stream?

Whatever has accrued to the NGO up to that moment is settled to them
first; whatever's left comes back to you immediately. Cancelling never
claws back funds the NGO already earned. See the [donor guide](./donor-guide.md).

### What happens if I lose access to my wallet?

A stream you started keeps running exactly as the contract defines it —
losing your wallet doesn't stop or affect it. What you lose is the
ability to manage it: modifying the rate or cancelling both require your
signature. For NGOs, the stakes are higher: your wallet is your
withdrawal key, with no recovery mechanism — see the [NGO guide](./ngo-guide.md).

### Can an NGO receive donations before being verified?

On-chain, technically yes — `donation-vault` doesn't check the registry,
so a stream can target any address. In the app, no: the NGO explorer only
ever lists verified NGOs, so there's no path to donate to an unverified
one without directly calling the contract yourself.

### Why does the dashboard look out of date right after I do something?

Actions confirm on-chain immediately, but the numbers you see come from a
backend indexer that polls the chain on an interval (a few seconds by
default), not from the chain directly. Give it a moment before assuming
something's wrong.

### What fees does StreamGive take?

None, unless whoever operates a given instance configures one. The
contract supports an optional protocol fee, hard-capped at 10%, that only
applies once an admin sets both a treasury address and a fee percentage —
with no treasury configured, the full accrued amount always goes to the
NGO.

### Can I run my own instance of StreamGive?

Yes — it's open source across four repos: [contracts](https://github.com/streamgive/streamgive-contracts),
[backend](https://github.com/streamgive/streamgive-backend),
[frontend](https://github.com/streamgive/streamgive-frontend), and this
docs site. See [Deploying the contracts](./deploying-contracts.md) and
[Local development](./local-development.md) to get started.

### What network does StreamGive run on?

[Stellar](https://stellar.org), via Soroban smart contracts. Everything
in this documentation defaults to testnet; running on mainnet is a
deliberate, manual step an operator takes — see [Deploying the contracts](./deploying-contracts.md#mainnet).
