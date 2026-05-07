import type { AttributeKind, LocalProfile, ProfileAttribute } from '../profile/schema'
import {
  addDigest,
  createBloomFilter,
  deserializeBloomFilter,
  mightContainDigest,
  serializeBloomFilter,
  type SerializedBloomFilter,
} from './bloom'
import { sha256Hex } from './encoding'
import { canonicalToken } from './normalization'

export const EXCHANGE_VERSION = 'match-proof.exchange.v1'
export const DEFAULT_BLOOM_SIZE = 2048
export const DEFAULT_BLOOM_HASHES = 7

export interface MatchRecord {
  attributeId: string
  kind: AttributeKind
  label: string
  value: string
  digest: string
  labelHash: string
  issuer?: string
}

export interface HelloEnvelope {
  type: 'hello'
  version: typeof EXCHANGE_VERSION
  sessionId: string
  sentAt: string
  sender: {
    profileId: string
    displayName: string
    headline: string
  }
  capabilities: string[]
  bloom: SerializedBloomFilter
  attributeCount: number
}

export interface PreparedSession {
  hello: HelloEnvelope
  records: MatchRecord[]
}

export interface ProofRequestEnvelope {
  type: 'proof-request'
  version: typeof EXCHANGE_VERSION
  sessionId: string
  requestedDigests: string[]
}

export interface ConstraintProof {
  system: 'prototype-zk-constraint-envelope-v1'
  verifier: 'sha-256-transcript-v1'
  statement: string
  publicSignals: {
    sessionHash: string
    digest: string
    kind: AttributeKind
  }
  proofDigest: string
}

export interface BbsProofPacket {
  id: string
  kind: AttributeKind
  digest: string
  ciphersuite: 'BLS12-381-SHA-256'
  publicKey: string
  proof: string
  header: string
  presentationHeader: string
  disclosedMessages: string[]
  disclosedMessageIndexes: number[]
  constraintProof: ConstraintProof
  issuedAt: string
}

export interface ProofResponseEnvelope {
  type: 'proof-response'
  version: typeof EXCHANGE_VERSION
  sessionId: string
  packets: BbsProofPacket[]
}

export interface VerifiedProof {
  digest: string
  kind: AttributeKind
  bbsVerified: boolean
  constraintVerified: boolean
  accepted: boolean
}

export interface VerifiedMatch {
  digest: string
  kind: AttributeKind
  label: string
  value: string
  issuer?: string
  bbsVerified: boolean
  constraintVerified: boolean
}

export type WireEnvelope = HelloEnvelope | ProofRequestEnvelope | ProofResponseEnvelope

export function createSessionId(): string {
  return crypto.randomUUID()
}

export async function prepareProfileSession(
  profile: LocalProfile,
  sessionId: string,
): Promise<PreparedSession> {
  const records = await Promise.all(
    profile.attributes.map((attribute) => toMatchRecord(attribute, sessionId)),
  )
  const bloom = createBloomFilter(DEFAULT_BLOOM_SIZE, DEFAULT_BLOOM_HASHES)

  for (const record of records) {
    addDigest(bloom, record.digest)
  }

  return {
    hello: {
      type: 'hello',
      version: EXCHANGE_VERSION,
      sessionId,
      sentAt: new Date().toISOString(),
      sender: {
        profileId: profile.id,
        displayName: profile.displayName,
        headline: profile.headline,
      },
      capabilities: ['bbs-selective-disclosure', 'bloom-filter-v1', 'prototype-zk-constraint-envelope'],
      bloom: serializeBloomFilter(bloom),
      attributeCount: records.length,
    },
    records,
  }
}

export function buildProofRequest(prepared: PreparedSession, peerHello: HelloEnvelope): ProofRequestEnvelope {
  if (peerHello.version !== EXCHANGE_VERSION) {
    throw new Error(`Unsupported exchange version: ${peerHello.version}`)
  }
  if (peerHello.sessionId !== prepared.hello.sessionId) {
    throw new Error('Session mismatch between local and peer envelopes')
  }

  const peerBloom = deserializeBloomFilter(peerHello.bloom)
  const requestedDigests = prepared.records
    .filter((record) => mightContainDigest(peerBloom, record.digest))
    .map((record) => record.digest)

  return {
    type: 'proof-request',
    version: EXCHANGE_VERSION,
    sessionId: prepared.hello.sessionId,
    requestedDigests,
  }
}

export function materializeMatches(records: MatchRecord[], verified: VerifiedProof[]): VerifiedMatch[] {
  const byDigest = new Map(records.map((record) => [record.digest, record]))
  const matches: VerifiedMatch[] = []

  for (const proof of verified.filter((candidate) => candidate.accepted)) {
    const record = byDigest.get(proof.digest)
    if (!record) {
      continue
    }
    matches.push({
      digest: proof.digest,
      kind: proof.kind,
      label: record.label,
      value: record.value,
      issuer: record.issuer,
      bbsVerified: proof.bbsVerified,
      constraintVerified: proof.constraintVerified,
    })
  }

  return matches
}

async function toMatchRecord(attribute: ProfileAttribute, sessionId: string): Promise<MatchRecord> {
  const token = canonicalToken(attribute)
  const digest = await sha256Hex(`${EXCHANGE_VERSION}:${sessionId}:${token}`)
  const labelHash = await sha256Hex(`${attribute.kind}:${attribute.label}:${attribute.issuer ?? 'self'}`)

  return {
    attributeId: attribute.id,
    kind: attribute.kind,
    label: attribute.label,
    value: attribute.value,
    issuer: attribute.issuer,
    digest,
    labelHash,
  }
}
