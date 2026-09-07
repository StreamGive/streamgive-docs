---
sidebar_position: 3
---

# Contracts reference

Two Soroban contracts, in [streamgive-contracts](https://github.com/streamgive/streamgive-contracts).
Every mutating function here requires the auth of whichever address is
named in its own doc comment below (checked via `require_auth`, not
inferred).

## ngo-registry

Owns one fact: whether an address is a verified NGO.

### Storage

| Type | Fields |
| --- | --- |
| `Ngo` | `owner: Address`, `name: String`, `verified: bool` |

| `DataKey` variant | Points to |
| --- | --- |
| `Admin` | The registry admin `Address` (instance storage) |
| `Ngo(Address)` | An `Ngo` record, keyed by the NGO's own address (persistent storage) |

### Errors

| Code | Name | Meaning |
| --- | --- | --- |
| 1 | `AlreadyInitialized` | `init` called more than once |
| 2 | `NotInitialized` | Admin read before `init` |
| 3 | `AlreadyRegistered` | `register` called twice for the same address |
| 4 | `NotRegistered` | Looked up (or tried to approve) an address with no entry |

### Functions

```rust
fn init(env: Env, admin: Address) -> Result<(), Error>
```
Sets the admin. Once only.

```rust
fn admin(env: Env) -> Result<Address, Error>
```
Read-only.

```rust
fn register(env: Env, owner: Address, name: String) -> Result<(), Error>
```
**Requires `owner`'s auth.** Self-service: an NGO registers itself.
Creates an entry with `verified: false`. Emits a `register` event —
topics `(Symbol("register"), owner)`, data `name`.

```rust
fn get_ngo(env: Env, owner: Address) -> Result<Ngo, Error>
```
Read-only. Returns the entry whether verified or not.

```rust
fn approve_ngo(env: Env, ngo_owner: Address) -> Result<(), Error>
```
**Requires the admin's auth.** Flips `verified` to `true` on an existing
entry. Emits an `approved` event — topics `(Symbol("approved"), ngo_owner)`,
no data.

## donation-vault

Holds every stream's escrowed balance. Notably, **this contract doesn't
check ngo-registry at all** — `create_stream` accepts any address as the
NGO, verified or not. [Deploying the contracts](./deploying-contracts.md#operational-note-the-registry-and-the-vault-dont-check-each-other)
covers why that's a deliberate choice and what it means operationally.

### Storage

| Type | Fields |
| --- | --- |
| `Stream` | `donor: Address`, `ngo: Address`, `token: Address`, `rate: i128`, `balance: i128`, `withdrawn: i128`, `last_update: u64` |

| `DataKey` variant | Points to |
| --- | --- |
| `Admin` | The vault admin `Address` (instance) |
| `NextStreamId` | The `u64` counter for the next stream's id (instance) |
| `Stream(u64)` | A `Stream` record, keyed by its id (persistent) |
| `Paused` | `bool` — whether fund-moving actions are halted (instance) |
| `Treasury` | Optional `Address` the protocol fee is paid to (instance) |
| `FeeBps` | `u32` protocol fee in basis points, capped at 1000 (10%) (instance) |

### Errors

| Code | Name | Meaning |
| --- | --- | --- |
| 1 | `AlreadyInitialized` | `init` called more than once |
| 2 | `NotInitialized` | Admin read before `init` |
| 3 | `StreamNotFound` | No stream with that id |
| 4 | `InvalidAmount` | A deposit, rate, or top-up amount was ≤ 0 |
| 5 | `NothingToWithdraw` | Nothing has accrued since the last withdrawal |
| 6 | `ContractPaused` | Called a paused action while the vault is paused |
| 7 | `FeeTooHigh` | `set_fee_bps` called with more than 1000 (10%) |

### Accrual

Every function that pays out to the NGO uses the same rule:

```
accrued = min(rate * seconds_since_last_update, balance)
```

computed with saturating arithmetic — it can never overflow or panic,
just cap out. `withdraw`, `cancel_stream`, `top_up`, and `modify_rate` all
settle whatever has accrued *before* changing anything else, so donors and
NGOs never lose or double-count funds across a top-up, a rate change, or a
cancellation.

### Functions

```rust
fn init(env: Env, admin: Address) -> Result<(), Error>
```
Sets the admin and seeds the stream-id counter. Once only.

```rust
fn admin(env: Env) -> Result<Address, Error>
fn get_stream(env: Env, stream_id: u64) -> Result<Stream, Error>
fn paused(env: Env) -> bool
fn treasury(env: Env) -> Option<Address>
fn fee_bps(env: Env) -> u32
```
Read-only.

```rust
fn pause(env: Env) -> Result<(), Error>
fn unpause(env: Env) -> Result<(), Error>
```
**Require the admin's auth.** Halts (or restores) `create_stream`,
`withdraw`, `top_up`, and `modify_rate`. `cancel_stream` is deliberately
exempt — pausing stops new activity, it never traps donor funds already
in the vault. Emit `pause` / `unpause` events (no data).

```rust
fn set_treasury(env: Env, treasury: Address) -> Result<(), Error>
fn set_fee_bps(env: Env, fee_bps: u32) -> Result<(), Error>
```
**Require the admin's auth.** Configure the optional protocol fee. With no
treasury set, no fee is ever taken regardless of `fee_bps`.

```rust
fn create_stream(env: Env, donor: Address, ngo: Address, token: Address, deposit: i128, rate: i128) -> Result<u64, Error>
```
**Requires `donor`'s auth.** Pulls `deposit` of `token` into the vault.
Returns the new stream's id. Emits a `created` event — topics
`(Symbol("created"), stream_id)`, data `(donor, ngo, token, deposit, rate)`.

```rust
fn withdraw(env: Env, stream_id: u64) -> Result<i128, Error>
```
**Requires the stream's `ngo`'s auth.** Pays out everything accrued since
the last checkpoint (minus the protocol fee, if any) and returns the gross
accrued amount. Emits a `withdraw` event — topics
`(Symbol("withdraw"), stream_id)`, data `accrued`.

```rust
fn cancel_stream(env: Env, stream_id: u64) -> Result<(), Error>
```
**Requires the stream's `donor`'s auth.** Settles accrued funds to the
NGO, refunds the untouched remainder to the donor, and zeroes the
stream's rate and balance — the record itself is kept, not deleted, so its
history stays queryable. Emits a `cancel` event — topics
`(Symbol("cancel"), stream_id)`, data `(accrued, refund)`.

```rust
fn top_up(env: Env, stream_id: u64, amount: i128) -> Result<(), Error>
```
**Requires the stream's `donor`'s auth.** Adds `amount` to the stream's
balance, after settling whatever had already accrued. Emits a `topup`
event — topics `(Symbol("topup"), stream_id)`, data `amount`.

```rust
fn modify_rate(env: Env, stream_id: u64, new_rate: i128) -> Result<(), Error>
```
**Requires the stream's `donor`'s auth.** Changes the per-second rate,
after settling whatever had accrued at the *old* rate — the new rate only
ever applies going forward, never retroactively. Emits a `ratemod`
event — topics `(Symbol("ratemod"), stream_id)`, data `new_rate`.
