---
sidebar_position: 9
---

# Integrating the donate widget

Any verified NGO can embed a donate form directly on their own website,
so a visitor never has to leave it to start a stream.

## Get your snippet

Visit `/ngo-admin` with your NGO's wallet connected — there's an **Embed
your donate widget** section with a ready-made snippet:

```html
<iframe src="https://<your-streamgive-instance>/embed/<your-ngo-id>" width="400" height="600" style="border:0"></iframe>
```

Paste it wherever you want the donate form to appear.

## Don't sandbox it

If you're embedding this inside a page that already restricts iframes
(a CMS block, a security-conscious page template), make sure the `<iframe>`
doesn't carry a restrictive `sandbox` attribute. Wallet connection needs
to open popups and run scripts inside the frame — a locked-down sandbox
breaks that silently, with no obvious error to point at.

## What's inside

The embedded page is deliberately bare: your NGO's name, "Powered by
StreamGive," and the donate form itself — no navigation, no header, no
footer. It's meant to feel like part of your page, not a portal to a
different site.

## Why this route (and only this one)

Every other page in the app sends an `X-Frame-Options: DENY` header,
blocking exactly this kind of embedding as a general security precaution.
The `/embed/*` route is explicitly exempted from that — it's the one
route in the app whose entire purpose is being framed by someone else's
site. It's also marked `noindex` for search engines, since it's meant to
be found through your site, not through search results pointing at the
StreamGive instance directly.
