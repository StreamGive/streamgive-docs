---
sidebar_position: 6
---

# Local development

Each repo documents its own setup in its own README; this page is the
order to actually run them in, end to end, with one instance of everything
talking to the others correctly.

Clone all four repos as siblings — the paths below assume that layout:

```
StreamGive/
├── streamgive-contracts/
├── streamgive-backend/
├── streamgive-frontend/
└── streamgive-docs/
```

## 1. Deploy the contracts (once)

Follow [Deploying the contracts](./deploying-contracts.md) to get both
contracts onto testnet. Keep the resulting `deployments.json` — its two
contract IDs feed both of the next two steps. You don't need to repeat
this for every local session, only when you don't have a deployment yet
or want a fresh one.

## 2. Start the backend

```bash
cd streamgive-backend
cp .env.example .env
docker compose up -d postgres   # also creates a streamgive_test DB
npm install
```

Edit `.env`: set `NGO_REGISTRY_CONTRACT_ID` and `DONATION_VAULT_CONTRACT_ID`
from step 1's `deployments.json`, and `ADMIN_ADDRESS` to whichever Stellar
address you want to act as platform admin (it doesn't have to be the
contracts' deploy admin, but it's simplest if it is, locally).

```bash
npm run db:push
npm run dev
```

The API is now at `http://localhost:3000`. `GET /health` should return
`{"status":"ok"}`.

## 3. Start the frontend

```bash
cd streamgive-frontend
cp .env.example .env
npm install
```

Edit `.env`: `NEXT_PUBLIC_API_URL` should already default to
`http://localhost:3000`; set `NEXT_PUBLIC_DONATION_VAULT_CONTRACT_ID` and
`NEXT_PUBLIC_NGO_REGISTRY_CONTRACT_ID` to the same two ids from step 1.

```bash
npm run dev
```

The app is now at `http://localhost:3001` (3000 is taken by the backend).

## 4. Smoke test

1. Visit `http://localhost:3001`, connect a testnet-funded wallet.
2. Visit `/apply` and submit an NGO application.
3. From the backend side, approve it — either through `/platform-admin`
   in the running frontend (once you're connected as the `ADMIN_ADDRESS`
   you set in step 2), or directly against the API using the signing
   scheme in the [API reference](./api-reference.md#authentication).
4. The newly verified NGO should now show up on `/ngos`. Start a stream to
   it, then check `/dashboard` — the indexer polls on an interval
   (`INDEXER_POLL_INTERVAL_MS`, default 5s), so a just-confirmed action can
   take a few seconds to show up.

If something doesn't show up at all rather than just lagging, check the
backend's own terminal output first — indexer errors log there, not to
the frontend.
