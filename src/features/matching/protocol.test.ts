import { describe, expect, it } from 'vitest'
import { aliceProfile, bobProfile } from '../profile/defaultProfiles'
import { BloomFilterValidationError } from './bloom'
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

  it('rejects a hostile saturated bloom filter from a peer hello', async () => {
    const sessionId = crypto.randomUUID()
    const alice = await prepareProfileSession(aliceProfile, sessionId)
    const bob = await prepareProfileSession(bobProfile, sessionId)
    // Build a fresh all-1s payload at the exact byte length the size implies,
    // then base64url-encode it so deserialize accepts the shape but the
    // fill-ratio guard fires.
    const bitsLength = Math.ceil(bob.hello.bloom.size / 8)
    const saturatedBits = new Uint8Array(bitsLength).fill(0xff)
    const saturatedBitsBase64 = btoa(String.fromCharCode(...saturatedBits))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')
    const hostileHello = {
      ...bob.hello,
      bloom: { ...bob.hello.bloom, bits: saturatedBitsBase64 },
    }

    expect(() => buildProofRequest(alice, hostileHello)).toThrow(BloomFilterValidationError)
    try {
      buildProofRequest(alice, hostileHello)
    } catch (cause) {
      expect(cause).toBeInstanceOf(BloomFilterValidationError)
      expect((cause as BloomFilterValidationError).code).toBe('fill-ratio-too-high')
    }
  })
})
