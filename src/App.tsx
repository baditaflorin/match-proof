import { useEffect, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { MatchConsole } from './components/MatchConsole'
import { ProfileEditor } from './components/ProfileEditor'
import { loadActiveProfile, saveActiveProfile } from './features/profile/storage'
import type { LocalProfile } from './features/profile/schema'

function App() {
  const [profile, setProfile] = useState<LocalProfile>()
  const [toast, setToast] = useState<string>()

  useEffect(() => {
    let active = true
    loadActiveProfile()
      .then((loaded) => {
        if (active) {
          setProfile(loaded)
        }
      })
      .catch((error) => setToast(error instanceof Error ? error.message : 'Could not load profile'))

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!profile) {
      return
    }
    const timeout = window.setTimeout(() => {
      saveActiveProfile(profile).catch((error) =>
        setToast(error instanceof Error ? error.message : 'Could not save profile'),
      )
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [profile])

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <AppHeader />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.3fr]">
        <div className="grid content-start gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-normal text-teal-800">
              Proof-of-attribute matching
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-normal">
              Find shared context without exposing the rest.
            </h1>
            <p className="mt-3 leading-7 text-slate-700">
              Profiles stay local. WebRTC carries session-specific Bloom filters and selective proof packets.
              Only verified overlap appears in the result list.
            </p>
          </section>

          {profile ? <ProfileEditor profile={profile} onChange={setProfile} /> : null}
        </div>

        {profile ? <MatchConsole profile={profile} onError={setToast} /> : null}
      </section>

      {toast ? (
        <div
          className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-lg border border-red-200 bg-white p-4 text-sm shadow-lg"
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast}</p>
            <button className="font-semibold text-red-700" type="button" onClick={() => setToast(undefined)}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
