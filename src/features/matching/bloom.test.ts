import { describe, expect, it } from 'vitest'
import {
  addDigest,
  bloomFillRatio,
  BloomFilterValidationError,
  createBloomFilter,
  deserializeBloomFilter,
  mightContainDigest,
  serializeBloomFilter,
} from './bloom'
import { sha256Hex } from './encoding'

describe('Bloom filter matching', () => {
  it('recognizes inserted session digests without storing raw values', async () => {
    const filter = createBloomFilter(256, 5)
    const digest = await sha256Hex('session:education:university-of-bucharest')
    const other = await sha256Hex('session:interest:espresso')

    addDigest(filter, digest)

    expect(mightContainDigest(filter, digest)).toBe(true)
    expect(mightContainDigest(filter, other)).toBe(false)
  })

  it('round-trips serialized filters', async () => {
    const filter = createBloomFilter()
    const digest = await sha256Hex('session:credential:zk')
    addDigest(filter, digest)

    const restored = deserializeBloomFilter(serializeBloomFilter(filter))

    expect(mightContainDigest(restored, digest)).toBe(true)
  })

  it('rejects pathologically small filters that match everything', () => {
    const bits = new Uint8Array([0xff])
    expect(() =>
      deserializeBloomFilter({ size: 8, hashes: 5, bits: btoa(String.fromCharCode(...bits)) }),
    ).toThrow(BloomFilterValidationError)
  })

  it('rejects too few or too many hash functions', () => {
    const bits = new Uint8Array(256)
    const empty = btoa(String.fromCharCode(...bits))
    expect(() => deserializeBloomFilter({ size: 2048, hashes: 1, bits: empty })).toThrow(/hash functions/)
    expect(() => deserializeBloomFilter({ size: 2048, hashes: 32, bits: empty })).toThrow(/hash functions/)
  })

  it('rejects saturated filters that would force universal disclosure', async () => {
    const filter = createBloomFilter(256, 5)
    // Fill ~85% of the bits: a real profile never has this fill ratio so
    // this is treated as a hostile peer trying to extract every attribute.
    for (let i = 0; i < filter.bits.length; i += 1) {
      filter.bits[i] = i % 6 === 0 ? 0x00 : 0xff
    }
    const ratio = bloomFillRatio(filter)
    expect(ratio).toBeGreaterThan(0.7)
    expect(() => deserializeBloomFilter(serializeBloomFilter(filter))).toThrow(/fill ratio/i)
  })

  it('accepts legitimately populated filters', async () => {
    const filter = createBloomFilter(2048, 7)
    for (let i = 0; i < 30; i += 1) {
      addDigest(filter, await sha256Hex(`legit:${i}`))
    }
    expect(() => deserializeBloomFilter(serializeBloomFilter(filter))).not.toThrow()
  })
})
