import type { LocalProfile } from '../profile/schema'
import type { VerifiedMatch } from '../matching/protocol'

export async function summarizeMatches(profile: LocalProfile, matches: VerifiedMatch[]): Promise<string> {
  if (matches.length === 0) {
    return 'No verified overlap yet. Nothing else was revealed.'
  }

  const browserModel = window.LanguageModel ?? window.ai?.languageModel
  if (browserModel) {
    try {
      const session = await browserModel.create()
      const response = await session.prompt(
        `Summarize these private verified matches for ${profile.displayName} in one sentence: ${matches
          .map((match) => `${match.kind}:${match.value}`)
          .join(', ')}`,
      )
      session.destroy?.()
      return response.trim()
    } catch {
      return deterministicSummary(matches)
    }
  }

  return deterministicSummary(matches)
}

function deterministicSummary(matches: VerifiedMatch[]): string {
  const kinds = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  }).format([...new Set(matches.map((match) => match.kind))])
  return `${matches.length} verified match${matches.length === 1 ? '' : 'es'} across ${kinds}; hidden profile fields stayed local.`
}
