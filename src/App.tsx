import { ExternalLink, GitFork, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
declare const __APP_VERSION__: string
declare const __APP_COMMIT__: string

function App() {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <a className="flex items-center gap-2 font-semibold" href="/match-proof/">
            <ShieldCheck className="size-5 text-teal-700" aria-hidden="true" />
            Match Proof
          </a>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 font-medium shadow-sm transition hover:border-slate-500"
              href="https://github.com/baditaflorin/match-proof"
              rel="noreferrer"
              target="_blank"
            >
              <GitFork className="size-4" aria-hidden="true" />
              Star on GitHub
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-100 px-3 py-2 font-medium text-amber-950 shadow-sm transition hover:border-amber-500"
              href="https://www.paypal.com/paypalme/florinbadita"
              rel="noreferrer"
              target="_blank"
            >
              <HeartHandshake className="size-4" aria-hidden="true" />
              Support
            </a>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-900">
              <Sparkles className="size-4" aria-hidden="true" />
              Browser-only proof-of-attribute matching
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Meet people without leaking the rest of your life.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Two conference attendees can exchange peer-to-peer proofs for shared interests,
              credentials, and constraints. Only verified matches are surfaced.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Build status</h2>
              <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                v{__APP_VERSION__}
              </span>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                <dt className="font-medium text-slate-600">Commit</dt>
                <dd className="font-mono">{__APP_COMMIT__}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                <dt className="font-medium text-slate-600">Deployment</dt>
                <dd>GitHub Pages</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                <dt className="font-medium text-slate-600">Runtime</dt>
                <dd>No backend</dd>
              </div>
            </dl>
            <a
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              href="https://github.com/baditaflorin/match-proof"
              rel="noreferrer"
              target="_blank"
            >
              Repository
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
