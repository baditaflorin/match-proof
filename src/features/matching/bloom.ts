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

// Bounds defended against hostile peers. A real profile has at most a few
// dozen attributes, so the filter never needs more than a few KB of bits or
// more than a dozen hashes. Values outside this range are either pathological
// attacks (size=1, hashes=1 makes every query a match) or denial-of-service
// (very large hash counts burn CPU per probe).
const MIN_BLOOM_SIZE = 256
const MAX_BLOOM_SIZE = 16384
const MIN_BLOOM_HASHES = 3
const MAX_BLOOM_HASHES = 16
// Above 70% fill the false-positive rate explodes and the filter starts to
// look like an "everything matches" oracle. Legitimate profiles with the
// default 2048/7 layout stay well under 5%.
const MAX_BLOOM_FILL_RATIO = 0.7

export type BloomFilterValidationCode =
  | 'size-out-of-range'
  | 'hashes-out-of-range'
  | 'bits-length-mismatch'
  | 'fill-ratio-too-high'

export class BloomFilterValidationError extends Error {
  readonly code: BloomFilterValidationCode

  constructor(message: string, code: BloomFilterValidationCode) {
    super(message)
    this.name = 'BloomFilterValidationError'
    this.code = code
  }
}

export function createBloomFilter(size = 2048, hashes = 7): BloomFilter {
  if (size < MIN_BLOOM_SIZE || size > MAX_BLOOM_SIZE) {
    throw new BloomFilterValidationError(
      `Bloom filter size must be between ${MIN_BLOOM_SIZE} and ${MAX_BLOOM_SIZE} bits, got ${size}.`,
      'size-out-of-range',
    )
  }
  if (hashes < MIN_BLOOM_HASHES || hashes > MAX_BLOOM_HASHES) {
    throw new BloomFilterValidationError(
      `Bloom filter must use between ${MIN_BLOOM_HASHES} and ${MAX_BLOOM_HASHES} hash functions, got ${hashes}.`,
      'hashes-out-of-range',
    )
  }
  return {
    size,
    hashes,
    bits: new Uint8Array(Math.ceil(size / 8)),
  }
}

export function bloomFillRatio(filter: BloomFilter): number {
  let onBits = 0
  for (const byte of filter.bits) {
    onBits += popcount(byte)
  }
  return onBits / Math.max(1, filter.size)
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
  if (serialized.size < MIN_BLOOM_SIZE || serialized.size > MAX_BLOOM_SIZE) {
    throw new BloomFilterValidationError(
      `Bloom filter size must be between ${MIN_BLOOM_SIZE} and ${MAX_BLOOM_SIZE} bits, got ${serialized.size}.`,
      'size-out-of-range',
    )
  }
  if (serialized.hashes < MIN_BLOOM_HASHES || serialized.hashes > MAX_BLOOM_HASHES) {
    throw new BloomFilterValidationError(
      `Bloom filter must use between ${MIN_BLOOM_HASHES} and ${MAX_BLOOM_HASHES} hash functions, got ${serialized.hashes}.`,
      'hashes-out-of-range',
    )
  }
  const bits = base64UrlDecode(serialized.bits)
  if (bits.length !== Math.ceil(serialized.size / 8)) {
    throw new BloomFilterValidationError(
      'Bloom filter bit length does not match declared size.',
      'bits-length-mismatch',
    )
  }
  const filter: BloomFilter = {
    size: serialized.size,
    hashes: serialized.hashes,
    bits,
  }
  if (bloomFillRatio(filter) > MAX_BLOOM_FILL_RATIO) {
    throw new BloomFilterValidationError(
      `Bloom filter fill ratio exceeds ${Math.round(MAX_BLOOM_FILL_RATIO * 100)}%; suspect probing or saturation attack.`,
      'fill-ratio-too-high',
    )
  }
  return filter
}

function popcount(byte: number): number {
  let value = byte & 0xff
  value = value - ((value >> 1) & 0x55)
  value = (value & 0x33) + ((value >> 2) & 0x33)
  return (((value + (value >> 4)) & 0x0f) * 0x01) & 0xff
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
