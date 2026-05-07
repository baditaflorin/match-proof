# Privacy

Match Proof has no analytics, no backend, and no account system in v1.

## Stored Locally

- Profile display label
- Attribute entries
- Local demo settings

These values are stored in IndexedDB on the user's device.

## Exchanged With Peers

The WebRTC flow exchanges:

- Bloom filter bits for session-specific attribute digests
- proof requests for candidate digests that matched locally
- BBS proof packets for requested candidate matches
- connection metadata needed by WebRTC

Raw non-matching attributes are not intentionally sent.

## Not Collected

- No analytics events
- No cookies
- No server logs from this app
- No central profile database

## Security Note

V1 is a working prototype, not an audited identity system. Demo credential material is generated locally unless a future version adds real issuer integration.
