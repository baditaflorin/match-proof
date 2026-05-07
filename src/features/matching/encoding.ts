const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function utf8(input: string): Uint8Array {
  return encoder.encode(input)
}

export function fromUtf8(input: Uint8Array): string {
  return decoder.decode(input)
}

export async function sha256Bytes(input: string | Uint8Array): Promise<Uint8Array> {
  const data = typeof input === 'string' ? utf8(input) : input
  const copy = new Uint8Array(data) as Uint8Array<ArrayBuffer>
  const digest = await crypto.subtle.digest('SHA-256', copy)
  return new Uint8Array(digest)
}

export async function sha256Hex(input: string | Uint8Array): Promise<string> {
  return bytesToHex(await sha256Bytes(input))
}

export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have an even length')
  }
  const bytes = new Uint8Array(hex.length / 2)
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(input.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export function encodeJson(value: unknown): string {
  return base64UrlEncode(utf8(JSON.stringify(value)))
}

export function decodeJson<T>(value: string): T {
  return JSON.parse(fromUtf8(base64UrlDecode(value))) as T
}
