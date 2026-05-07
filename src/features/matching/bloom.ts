import { base64UrlDecode, base64UrlEncode, hexToBytes } from './encoding'

export interface BloomFilter {
  size: number
  hashes: number
  bits: Uint8Array
}

export interface SerializedBloomFilter {
  size: number
  hashes: number
  bits: string
}

export function createBloomFilter(size = 2048, hashes = 7): BloomFilter {
  return {
    size,
    hashes,
    bits: new Uint8Array(Math.ceil(size / 8)),
  }
}

export function addDigest(filter: BloomFilter, digestHex: string): void {
  for (const index of deriveIndexes(digestHex, filter.size, filter.hashes)) {
    filter.bits[Math.floor(index / 8)] |= 1 << (index % 8)
  }
}

export function mightContainDigest(filter: BloomFilter, digestHex: string): boolean {
  return deriveIndexes(digestHex, filter.size, filter.hashes).every((index) => {
    return (filter.bits[Math.floor(index / 8)] & (1 << (index % 8))) !== 0
  })
}

export function serializeBloomFilter(filter: BloomFilter): SerializedBloomFilter {
  return {
    size: filter.size,
    hashes: filter.hashes,
    bits: base64UrlEncode(filter.bits),
  }
}

export function deserializeBloomFilter(serialized: SerializedBloomFilter): BloomFilter {
  const bits = base64UrlDecode(serialized.bits)
  if (bits.length !== Math.ceil(serialized.size / 8)) {
    throw new Error('Bloom filter bit length does not match size')
  }
  return {
    size: serialized.size,
    hashes: serialized.hashes,
    bits,
  }
}

export function deriveIndexes(digestHex: string, size: number, hashes: number): number[] {
  const digest = hexToBytes(digestHex)
  const indexes: number[] = []

  for (let round = 0; round < hashes; round += 1) {
    const offset = (round * 4) % digest.length
    const word =
      ((digest[offset] ?? 0) << 24) |
      ((digest[(offset + 1) % digest.length] ?? 0) << 16) |
      ((digest[(offset + 2) % digest.length] ?? 0) << 8) |
      (digest[(offset + 3) % digest.length] ?? 0)
    const mixed = (word ^ Math.imul(round + 1, 0x9e3779b1)) >>> 0
    indexes.push(mixed % size)
  }

  return indexes
}
