import { z } from 'zod'

export const attributeKinds = ['education', 'work', 'interest', 'credential', 'constraint'] as const

export type AttributeKind = (typeof attributeKinds)[number]

export const attributeKindLabels: Record<AttributeKind, string> = {
  education: 'Education',
  work: 'Work',
  interest: 'Interest',
  credential: 'Credential',
  constraint: 'Constraint',
}

export const attributeSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(attributeKinds),
  label: z.string().min(1).max(80),
  value: z.string().min(1).max(120),
  detail: z.string().max(160).optional(),
  issuer: z.string().max(120).optional(),
  sensitive: z.boolean().default(true),
})

export const localProfileSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1).max(80),
  headline: z.string().max(140),
  attributes: z.array(attributeSchema).min(1),
  updatedAt: z.string().datetime(),
})

export type ProfileAttribute = z.infer<typeof attributeSchema>
export type LocalProfile = z.infer<typeof localProfileSchema>

export function createAttribute(kind: AttributeKind = 'interest'): ProfileAttribute {
  return {
    id: crypto.randomUUID(),
    kind,
    label: attributeKindLabels[kind],
    value: '',
    detail: '',
    issuer: '',
    sensitive: true,
  }
}

export function profileWithUpdatedAt(profile: LocalProfile): LocalProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  }
}
