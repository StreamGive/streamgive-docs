---
sidebar_position: 5
---

# Backend API reference

Base URL is whatever `PORT` [streamgive-backend](https://github.com/streamgive/streamgive-backend)
is running on (`http://localhost:3000` locally). All responses are JSON.
Every amount field (`rate`, `balance`, `withdrawn`, `totalCommitted`,
`totalWithdrawn`) is a decimal **string**, not a number — these are `i128`
values on-chain and can exceed what a JS/JSON number can represent
exactly. `onChainId` is likewise a string, not a raw `BigInt`.

## Public, read-only

### `GET /health`

Pings the database. `{ "status": "ok" }` on success.

### `GET /ngos`

Verified NGOs, newest first, capped at 100.

```json
[{ "id": "...", "ownerAddress": "G...", "name": "...", "verified": true, "createdAt": "...", "updatedAt": "..." }]
```

### `GET /ngos/:id`

One NGO's profile plus stats computed from its streams. `id` is the
internal id from `GET /ngos`, not a Stellar address. `400` if `id` isn't a
UUID, `404` if it doesn't exist.

```json
{
  "id": "...", "ownerAddress": "G...", "name": "...", "verified": true,
  "stats": {
    "totalCommitted": "1000000000",
    "totalWithdrawn": "500000000",
    "activeStreamCount": 3,
    "donorCount": 2
  }
}
```

`totalCommitted` is `balance + withdrawn` summed across all of the NGO's
streams — not the same as the original deposits once top-ups or
cancellations have happened. See the [architecture](./architecture.md)
page for why this can lag on-chain confirmations by a few seconds.

### `GET /impact/:ngoId`

A superset of `/ngos/:id`'s stats, framed around relative impact: active
vs. cancelled stream counts, and this NGO's share of everything ever
committed platform-wide. `404` if the NGO doesn't exist.

```json
{
  "ngoId": "...", "name": "...",
  "totalCommitted": "1000000000", "totalWithdrawn": "500000000",
  "activeStreams": 2, "cancelledStreams": 1,
  "uniqueDonors": 2, "platformSharePercent": 12.5
}
```

### `GET /streams?donor=&ngo=`

Both filters optional (an empty query returns everything, capped at 100).
`donor` is a Stellar address (`^G[A-Z2-7]{55}$`); `ngo` is the NGO's
internal id. `400` if either fails validation.

```json
[{
  "id": "...", "onChainId": "1", "tokenAddress": "C...",
  "rate": "10", "balance": "990", "withdrawn": "10",
  "status": "ACTIVE", "createdAt": "...", "updatedAt": "...",
  "donor": { "address": "G..." },
  "ngo": { "id": "...", "name": "...", "ownerAddress": "G..." }
}]
```

## Public, write

### `POST /ngo-applications`

Off-chain intake — reviewed by an admin before anyone calls the on-chain
`approve_ngo`. Rate-limited to 5 requests/minute (tighter than the
platform-wide 100/minute default, since it's the most spam-prone route in
the API).

```json
// request body
{
  "ownerAddress": "G...",
  "name": "...",
  "description": "...",
  "contactEmail": "you@example.org",
  "website": "https://example.org",   // optional
  "country": "..."                    // optional
}
```

`201` with the created application (`status: "PENDING"`) on success,
`400` on validation failure, `409` if that address already has a pending
application.

## Admin-only

These three require a signed request — see [Authentication](#authentication)
below. `503` if the backend has no `ADMIN_ADDRESS` configured; `401` if
the signature is missing, invalid, or stale.

### `GET /ngo-applications?status=`

`status` optional (`PENDING` | `APPROVED` | `REJECTED`); omitted returns
everything, capped at 100.

### `POST /ngo-applications/:id/approve`

### `POST /ngo-applications/:id/reject`

Both accept an optional body `{ "reviewNote": "..." }` and return the
updated application. Neither of these calls the on-chain `approve_ngo` —
that's a separate, deliberate step the frontend's platform admin panel
does first (see [architecture](./architecture.md)); this endpoint only
records the review decision.

## Authentication

Admin routes are gated by [SEP-53](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md)
message signing, not a session or API key. To call one:

1. Build `payload = "${method}:${path}:${timestamp}"` — `path` is exactly
   what the server sees as the request path *and* query string (e.g.
   `/ngo-applications?status=PENDING`), with no scheme or host, and
   `timestamp` is the current time in epoch milliseconds.
2. Sign `payload` with your wallet's generic message-signing call (not
   transaction signing) — the wallet applies the SEP-53 prefix and SHA-256
   hash itself.
3. Send three headers: `x-admin-address` (your public key), `x-admin-signature`
   (the signature, base64), `x-admin-timestamp` (the same timestamp used
   above, as a string).

The server rejects the request if `x-admin-address` doesn't match the
configured `ADMIN_ADDRESS`, if the timestamp is more than 5 minutes old
(bounding replay of a captured header set), or if the signature doesn't
verify. See `streamgive-frontend`'s `src/lib/adminApi.ts` for a complete,
working implementation of this flow.
