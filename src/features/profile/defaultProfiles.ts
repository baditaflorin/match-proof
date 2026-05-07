import type { LocalProfile } from './schema'

export const aliceProfile: LocalProfile = {
  id: 'demo-alice',
  displayName: 'Alice',
  headline: 'Privacy engineer visiting the conference floor',
  updatedAt: new Date('2026-05-01T09:00:00.000Z').toISOString(),
  attributes: [
    {
      id: 'alice-education-1',
      kind: 'education',
      label: 'University',
      value: 'University of Bucharest',
      detail: 'Year hidden',
      issuer: 'Demo University Issuer',
      sensitive: true,
    },
    {
      id: 'alice-interest-1',
      kind: 'interest',
      label: 'Research interest',
      value: 'zero knowledge systems',
      detail: 'Only shown if shared',
      issuer: 'Self-issued',
      sensitive: true,
    },
    {
      id: 'alice-credential-1',
      kind: 'credential',
      label: 'Credential',
      value: 'EU digital identity working group',
      detail: 'Credential body hidden',
      issuer: 'Demo Credential Issuer',
      sensitive: true,
    },
    {
      id: 'alice-constraint-1',
      kind: 'constraint',
      label: 'Constraint',
      value: 'no investor pitch meetings',
      detail: 'Boundary hidden unless matched',
      issuer: 'Self-issued',
      sensitive: true,
    },
  ],
}

export const bobProfile: LocalProfile = {
  id: 'demo-bob',
  displayName: 'Bob',
  headline: 'Founder exploring privacy-preserving social products',
  updatedAt: new Date('2026-05-01T09:00:00.000Z').toISOString(),
  attributes: [
    {
      id: 'bob-education-1',
      kind: 'education',
      label: 'University',
      value: 'University of Bucharest',
      detail: 'Year hidden',
      issuer: 'Demo University Issuer',
      sensitive: true,
    },
    {
      id: 'bob-interest-1',
      kind: 'interest',
      label: 'Research interest',
      value: 'zero knowledge systems',
      detail: 'Only shown if shared',
      issuer: 'Self-issued',
      sensitive: true,
    },
    {
      id: 'bob-work-1',
      kind: 'work',
      label: 'Industry',
      value: 'climate fintech',
      detail: 'Company hidden',
      issuer: 'Self-issued',
      sensitive: true,
    },
    {
      id: 'bob-constraint-1',
      kind: 'constraint',
      label: 'Constraint',
      value: 'morning meetings only',
      detail: 'Calendar details hidden',
      issuer: 'Self-issued',
      sensitive: true,
    },
  ],
}

export const defaultProfile = aliceProfile
