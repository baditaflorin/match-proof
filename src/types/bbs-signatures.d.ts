declare module '@digitalbazaar/bbs-signatures' {
  export const CIPHERSUITES: Record<string, string>

  export function generateKeyPair(options: { ciphersuite: string }): Promise<{
    secretKey: Uint8Array
    publicKey: Uint8Array
  }>

  export function sign(options: {
    secretKey: Uint8Array
    publicKey: Uint8Array
    header: Uint8Array
    messages: Uint8Array[]
    ciphersuite: string
  }): Promise<Uint8Array>

  export function deriveProof(options: {
    publicKey: Uint8Array
    signature: Uint8Array
    header: Uint8Array
    messages: Uint8Array[]
    presentationHeader: Uint8Array
    disclosedMessageIndexes: number[]
    ciphersuite: string
  }): Promise<Uint8Array>

  export function verifyProof(options: {
    publicKey: Uint8Array
    proof: Uint8Array
    header: Uint8Array
    presentationHeader: Uint8Array
    disclosedMessages: Uint8Array[]
    disclosedMessageIndexes: number[]
    ciphersuite: string
  }): Promise<boolean>
}
