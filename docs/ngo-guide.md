---
sidebar_position: 7
---

# NGO onboarding guide

This page is for organizations that want to receive streaming donations
through StreamGive, not for developers — see the [contracts](./contracts.md)
and [API](./api-reference.md) references for that.

## Before you start: pick your wallet carefully

Whichever Stellar wallet address you apply with becomes your NGO's
permanent identity on StreamGive. It's the address donors send to, and
the only address that can withdraw what's accrued. There's no "change of
address" flow — if you lose access to that wallet, you lose the ability
to withdraw future accruals from it, so treat it like you would any
account holding funds: a wallet your organization actually controls, not
someone's personal one.

## 1. Apply

Go to `/apply` on the app, connect that wallet, and fill in your
organization's name, a description, a contact email, and optionally a
website and country. Submitting doesn't cost anything or touch the
blockchain — it's an off-chain form the platform admin reviews.

You'll get one pending application per address at a time; submitting
again while one is already pending is rejected, not queued.

## 2. Wait for review

An admin reviews pending applications and either approves or rejects
them. There's no fixed SLA published here since it depends entirely on
who's running a given instance of StreamGive — check with whoever operates
the instance you applied to.

Approval is a two-part action on the admin's side: it calls the on-chain
`ngo-registry.approve_ngo`, which is what actually makes you a verified
NGO, and separately records the review decision. You don't need to do
anything for either part — both happen from a single "Approve" click on
the admin's side.

## 3. You're listed

Once approved, your organization appears on `/ngos`, and anyone can start
a stream to you from your profile page there. This can take a few seconds
after approval to show up — the frontend reads from an indexer that polls
the chain on an interval, not directly from it.

## 4. Receiving funds

Visit `/ngo-admin` with the same wallet you applied with. It lists every
stream currently pointed at you — donor, status, balance, and how much
you've already withdrawn — with a **Withdraw** button on each active one.

A few things worth knowing:

- Withdrawing pays out whatever has accrued *since your last withdrawal*,
  not the stream's whole remaining balance — the rest keeps accruing and
  is still there to withdraw later.
- If nothing has accrued yet (a stream just started, or you withdrew a
  moment ago), the withdraw call fails rather than doing nothing silently —
  that's expected, not a bug.
- A donor can cancel or adjust their own stream at any time. If they
  cancel, whatever had already accrued to you is settled to you
  automatically as part of that — you don't lose funds you'd already
  earned, only future accrual that hadn't happened yet.

## 5. Embedding a donate button on your own site

Every verified NGO gets an embeddable widget from their `/ngo-admin` page
so donors can start a stream without leaving your website. There's a
dedicated guide for that once you're ready to add it.
