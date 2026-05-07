import type { ProfileAttribute } from '../profile/schema'

export function normalizeValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function canonicalToken(attribute: Pick<ProfileAttribute, 'kind' | 'value'>): string {
  return `${attribute.kind}:${normalizeValue(attribute.value)}`
}
