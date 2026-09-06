---
sidebar_position: 4
---

# Deploying the contracts

## Prerequisites

- Rust with the `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`
- The [Stellar CLI](https://developers.stellar.org/docs/tools/cli): `winget install --id Stellar.StellarCLI` (or `cargo install --locked stellar-cli`)
- A funded identity on whichever network you're deploying to

## Testnet

Create and fund a testnet identity if you don't have one:

```bash
stellar keys generate streamgive-deployer --network testnet --fund
```

From the root of [streamgive-contracts](https://github.com/streamgive/streamgive-contracts):

```bash
STELLAR_SOURCE_ACCOUNT=streamgive-deployer ./scripts/deploy-testnet.sh
```

This builds both contracts, deploys them, calls `init` on each with the
deploying identity as admin, and writes a `deployments.json` at the repo
root:

```json
{
  "network": "testnet",
  "deployed_at": "...",
  "admin": "streamgive-deployer",
  "contracts": {
    "ngo-registry": "C...",
    "donation-vault": "C..."
  }
}
```

Copy the two contract IDs from there into:

- `streamgive-backend`'s `.env` — `NGO_REGISTRY_CONTRACT_ID` and
  `DONATION_VAULT_CONTRACT_ID` (the indexer no-ops until both are set).
- `streamgive-frontend`'s `.env` — `NEXT_PUBLIC_NGO_REGISTRY_CONTRACT_ID`
  and `NEXT_PUBLIC_DONATION_VAULT_CONTRACT_ID`.

## Mainnet

There's deliberately no `deploy-mainnet.sh` script — a mainnet deploy is a
higher-stakes, one-time operation worth doing by hand rather than
scripting. The steps are the same shape as testnet, with `--network
mainnet` (or `--network public`, depending on your CLI's configured
network aliases) and a real funded account instead of a friendbot-funded
test identity. Review the [contracts reference](./contracts.md) for what
`init`, `pause`, `set_treasury`, and `set_fee_bps` actually do before
running any of them against real funds.

## Operational note: the registry and the vault don't check each other

Worth internalizing before deploying either contract for real:
`donation-vault`'s `create_stream` doesn't check `ngo-registry` at all —
it will happily open a stream to any address, verified or not. This is a
deliberate contract-level choice (it keeps the vault simpler and avoids a
cross-contract call on every donation), but it pushes the responsibility
onto whoever operates the frontend and backend:

- The frontend's NGO explorer only ever lists NGOs the backend has marked
  `verified` — it doesn't and shouldn't offer a way to donate to an
  arbitrary address.
- If a stream is ever created directly (bypassing the frontend) to an
  address that was never registered, the indexer still records it — with
  a placeholder, unverified NGO entry — rather than dropping the data.
  That's intentional: the backend never discards real on-chain activity
  just because it doesn't fit the expected shape.

In short: verification is a curation layer the *apps* enforce, not
something the vault contract itself guarantees.
