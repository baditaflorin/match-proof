import * as Comlink from 'comlink'
import type { LocalProfile } from '../profile/schema'
import { base64UrlDecode, base64UrlEncode, sha256Hex, utf8 } from './encoding'
import {
  EXCHANGE_VERSION,
  materializeMatches,
  prepareProfileSession,
  type BbsProofPacket,
  type ConstraintProof,
  type PreparedSession,
  type ProofResponseEnvelope,
  type VerifiedMatch,
  type VerifiedProof,
} from './protocol'

const CIPHERSUITE = 'BLS12-381-SHA-256'
const DISCLOSED_MESSAGE_INDEXES = [0, 1, 2]

export interface CryptoWorkerApi {
  prepareSession(profile: LocalProfile, sessionId: string): Promise<PreparedSession>
  createProofResponse(
    profile: LocalProfile,
    sessionId: string,
    requestedDigests: string[],
  ): Promise<ProofResponseEnvelope>
  verifyProofResponse(
    response: ProofResponseEnvelope,
    sessionId: string,
    requestedDigests: string[],
    localRecords: PreparedSession['records'],
  ): Promise<{ verified: VerifiedProof[]; matches: VerifiedMatch[] }>
}

const api: CryptoWorkerApi = {
  prepareSession: prepareProfileSession,
  async createProofResponse(profile, sessionId, requestedDigests) {
    const bbs = await import('@digitalbazaar/bbs-signatures')
    const prepared = await prepareProfileSession(profile, sessionId)
    const requested = new Set(requestedDigests)
    const packets: BbsProofPacket[] = []

    for (const record of prepared.records.filter((candidate) => requested.has(candidate.digest))) {
      const { secretKey, publicKey } = await bbs.generateKeyPair({
        ciphersuite: CIPHERSUITE,
      })
      const header = utf8(`${EXCHANGE_VERSION}:header:${sessionId}`)
      const presentationHeader = utf8(`${EXCHANGE_VERSION}:presentation:${sessionId}:${record.digest}`)
      const messages = [
        utf8(EXCHANGE_VERSION),
        utf8(record.kind),
        utf8(record.digest),
        utf8(record.labelHash),
        utf8(await sha256Hex(`${record.issuer ?? 'self'}:${record.attributeId}`)),
      ]

      const signature = await bbs.sign({
        secretKey,
        publicKey,
        header,
        messages,
        ciphersuite: CIPHERSUITE,
      })
      const proof = await bbs.deriveProof({
        publicKey,
        signature,
        header,
        messages,
        presentationHeader,
        disclosedMessageIndexes: DISCLOSED_MESSAGE_INDEXES,
        ciphersuite: CIPHERSUITE,
      })

      packets.push({
        id: crypto.randomUUID(),
        kind: record.kind,
        digest: record.digest,
        ciphersuite: CIPHERSUITE,
        publicKey: base64UrlEncode(publicKey),
        proof: base64UrlEncode(proof),
        header: base64UrlEncode(header),
        presentationHeader: base64UrlEncode(presentationHeader),
        disclosedMessages: messages.slice(0, 3).map(base64UrlEncode),
        disclosedMessageIndexes: DISCLOSED_MESSAGE_INDEXES,
        constraintProof: await createConstraintProof(sessionId, record.kind, record.digest),
        issuedAt: new Date().toISOString(),
      })
    }

    return {
      type: 'proof-response',
      version: EXCHANGE_VERSION,
      sessionId,
      packets,
    }
  },
  async verifyProofResponse(response, sessionId, requestedDigests, localRecords) {
    const bbs = await import('@digitalbazaar/bbs-signatures')
    const requested = new Set(requestedDigests)
    const verified: VerifiedProof[] = []

    for (const packet of response.packets) {
      const bbsVerified =
        requested.has(packet.digest) &&
        (await bbs.verifyProof({
          publicKey: base64UrlDecode(packet.publicKey),
          proof: base64UrlDecode(packet.proof),
          header: base64UrlDecode(packet.header),
          presentationHeader: base64UrlDecode(packet.presentationHeader),
          disclosedMessages: packet.disclosedMessages.map(base64UrlDecode),
          disclosedMessageIndexes: packet.disclosedMessageIndexes,
          ciphersuite: packet.ciphersuite,
        }))
      const constraintVerified = await verifyConstraintProof(packet.constraintProof, sessionId)

      verified.push({
        digest: packet.digest,
        kind: packet.kind,
        bbsVerified,
        constraintVerified,
        accepted: bbsVerified && constraintVerified && requested.has(packet.digest),
      })
    }

    return {
      verified,
      matches: materializeMatches(localRecords, verified),
    }
  },
}

async function createConstraintProof(
  sessionId: string,
  kind: BbsProofPacket['kind'],
  digest: string,
): Promise<ConstraintProof> {
  const sessionHash = await sha256Hex(`${EXCHANGE_VERSION}:session:${sessionId}`)
  return {
    system: 'prototype-zk-constraint-envelope-v1',
    verifier: 'sha-256-transcript-v1',
    statement: 'Claim digest is bound to the session and attribute kind without disclosing hidden fields.',
    publicSignals: {
      sessionHash,
      digest,
      kind,
    },
    proofDigest: await sha256Hex(`${EXCHANGE_VERSION}:constraint:${sessionHash}:${kind}:${digest}`),
  }
}

async function verifyConstraintProof(proof: ConstraintProof, sessionId: string): Promise<boolean> {
  const expected = await createConstraintProof(
    sessionId,
    proof.publicSignals.kind,
    proof.publicSignals.digest,
  )
  return (
    proof.system === expected.system &&
    proof.verifier === expected.verifier &&
    proof.publicSignals.sessionHash === expected.publicSignals.sessionHash &&
    proof.proofDigest === expected.proofDigest
  )
}

Comlink.expose(api)
