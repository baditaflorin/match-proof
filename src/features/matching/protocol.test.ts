import { describe, expect, it } from 'vitest'
import { aliceProfile, bobProfile } from '../profile/defaultProfiles'
import { buildProofRequest, prepareProfileSession } from './protocol'

describe('proof exchange protocol', () => {
  it('requests only local candidate digests that hit the peer Bloom filter', async () => {
    const sessionId = crypto.randomUUID()
    const alice = await prepareProfileSession(aliceProfile, sessionId)
    const bob = await prepareProfileSession(bobProfile, sessionId)

    const request = buildProofRequest(alice, bob.hello)

    expect(request.requestedDigests).toHaveLength(2)
    expect(request.requestedDigests.every((digest) => /^[a-f0-9]{64}$/.test(digest))).toBe(true)
  })

  it('uses session-specific digests', async () => {
    const first = await prepareProfileSession(aliceProfile, crypto.randomUUID())
    const second = await prepareProfileSession(aliceProfile, crypto.randomUUID())

    expect(first.records[0]?.digest).not.toEqual(second.records[0]?.digest)
  })
})
