import { describe, expect, it } from 'vitest'
import {
  addDigest,
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
})
