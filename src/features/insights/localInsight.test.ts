import { describe, expect, it } from 'vitest'
import { aliceProfile } from '../profile/defaultProfiles'
import type { VerifiedMatch } from '../matching/protocol'
import { summarizeMatches } from './localInsight'

describe('local insight fallback', () => {
  it('summarizes verified matches without remote analytics', async () => {
    const matches: VerifiedMatch[] = [
      {
        digest: 'abc',
        kind: 'education',
        label: 'University',
        value: 'University of Bucharest',
        bbsVerified: true,
        constraintVerified: true,
      },
    ]

    await expect(summarizeMatches(aliceProfile, matches)).resolves.toContain('1 verified match')
  })
})
