import { BadgeCheck, LockKeyhole, ShieldCheck } from 'lucide-react'
import { attributeKindLabels } from '../features/profile/schema'
import type { VerifiedMatch } from '../features/matching/protocol'

interface MatchResultsProps {
  matches: VerifiedMatch[]
  insight: string
}

export function MatchResults({ matches, insight }: MatchResultsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Verified matches</h2>
          <p className="text-sm text-slate-600">{insight}</p>
        </div>
        <span className="rounded-md bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-900">
          {matches.length} surfaced
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {matches.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
            No shared attribute has passed the Bloom filter and proof checks yet.
          </div>
        ) : (
          matches.map((match) => (
            <article className="rounded-lg border border-teal-200 bg-teal-50 p-4" key={match.digest}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-teal-900">{attributeKindLabels[match.kind]}</p>
                  <h3 className="text-lg font-semibold">{match.value}</h3>
                  <p className="text-sm text-slate-700">{match.label}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-teal-900 ring-1 ring-teal-200">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    BBS proof
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-slate-800 ring-1 ring-slate-200">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    ZK envelope
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-slate-800 ring-1 ring-slate-200">
                    <LockKeyhole className="size-3.5" aria-hidden="true" />
                    Non-matches hidden
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
