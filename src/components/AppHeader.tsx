import { ExternalLink, GitFork, HeartHandshake, ShieldCheck } from 'lucide-react'
import { APP_VERSION, BUILD_COMMIT, PAYPAL_URL, REPO_URL } from '../config'
import { useGithubMeta } from '../hooks/useGithubMeta'

export function AppHeader() {
  const github = useGithubMeta()
  const commit = github.data?.commit ?? BUILD_COMMIT

  return (
    <header className="border-b border-slate-200 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <a
          className="flex items-center gap-2 font-semibold"
          href="/match-proof/"
          aria-label="Match Proof home"
        >
          <ShieldCheck className="size-5 text-teal-700" aria-hidden="true" />
          <span>Match Proof</span>
        </a>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md bg-white px-2.5 py-1.5 font-mono text-xs shadow-sm ring-1 ring-slate-200">
            v{APP_VERSION} · {commit}
          </span>
          <a
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 font-medium shadow-sm transition hover:border-slate-500"
            href={REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            <GitFork className="size-4" aria-hidden="true" />
            Star {github.data?.stars ?? ''}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-100 px-3 py-2 font-medium text-amber-950 shadow-sm transition hover:border-amber-500"
            href={PAYPAL_URL}
            rel="noreferrer"
            target="_blank"
          >
            <HeartHandshake className="size-4" aria-hidden="true" />
            PayPal
          </a>
        </div>
      </div>
    </header>
  )
}
