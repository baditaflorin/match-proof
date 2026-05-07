import { Cable, FlaskConical, RadioTower, Send, Unplug } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { bobProfile } from '../features/profile/defaultProfiles'
import type { LocalProfile } from '../features/profile/schema'
import { summarizeMatches } from '../features/insights/localInsight'
import { getCryptoWorker } from '../features/matching/workerClient'
import {
  buildProofRequest,
  createSessionId,
  type HelloEnvelope,
  type PreparedSession,
  type ProofResponseEnvelope,
  type VerifiedMatch,
  type WireEnvelope,
} from '../features/matching/protocol'
import { MatchPeer, type PeerStatus } from '../features/webrtc/rtc'
import { MatchResults } from './MatchResults'
import { SignalBox } from './SignalBox'

interface MatchConsoleProps {
  profile: LocalProfile
  onError: (message: string) => void
}

export function MatchConsole({ profile, onError }: MatchConsoleProps) {
  const worker = useMemo(() => getCryptoWorker(), [])
  const peerRef = useRef<MatchPeer | undefined>(undefined)
  const preparedRef = useRef<PreparedSession | undefined>(undefined)
  const requestedRef = useRef<string[]>([])
  const [sessionId, setSessionId] = useState(() => createSessionId())
  const [status, setStatus] = useState<PeerStatus>('idle')
  const [busy, setBusy] = useState(false)
  const [offer, setOffer] = useState('')
  const [offerInput, setOfferInput] = useState('')
  const [answer, setAnswer] = useState('')
  const [answerInput, setAnswerInput] = useState('')
  const [peerHello, setPeerHello] = useState<HelloEnvelope>()
  const [matches, setMatches] = useState<VerifiedMatch[]>([])
  const [insight, setInsight] = useState('Only matches that pass proof checks will appear here.')

  async function prepareCurrentProfile(currentSessionId = sessionId) {
    const prepared = await worker.prepareSession(profile, currentSessionId)
    preparedRef.current = prepared
    return prepared
  }

  async function runLocalDemo() {
    await runAction(async () => {
      const demoSessionId = createSessionId()
      setSessionId(demoSessionId)
      const local = await worker.prepareSession(profile, demoSessionId)
      const peer = await worker.prepareSession(bobProfile, demoSessionId)
      const request = buildProofRequest(local, peer.hello)
      const response = await worker.createProofResponse(bobProfile, demoSessionId, request.requestedDigests)
      const result = await worker.verifyProofResponse(
        response,
        demoSessionId,
        request.requestedDigests,
        local.records,
      )
      preparedRef.current = local
      requestedRef.current = request.requestedDigests
      setPeerHello(peer.hello)
      setMatches(result.matches)
      setInsight(await summarizeMatches(profile, result.matches))
    })
  }

  async function hostSession() {
    await runAction(async () => {
      const nextSessionId = createSessionId()
      setSessionId(nextSessionId)
      const peer = createPeer(nextSessionId)
      peerRef.current = peer
      await prepareCurrentProfile(nextSessionId)
      setOffer(await peer.createOffer())
    })
  }

  async function joinSession() {
    await runAction(async () => {
      const decodedOffer = offerInput.trim()
      const peer = createPeer(sessionId)
      peerRef.current = peer
      const generatedAnswer = await peer.acceptOffer(decodedOffer)
      const remoteSessionId = await inferSessionAfterOffer()
      await prepareCurrentProfile(remoteSessionId)
      setAnswer(generatedAnswer)
    })
  }

  async function acceptAnswer() {
    await runAction(async () => {
      if (!peerRef.current) {
        throw new Error('Create an offer before accepting an answer')
      }
      await peerRef.current.acceptAnswer(answerInput)
    })
  }

  async function sendHello() {
    await runAction(async () => {
      const prepared = preparedRef.current ?? (await prepareCurrentProfile())
      peerRef.current?.send(prepared.hello)
    })
  }

  function disconnect() {
    peerRef.current?.close()
    peerRef.current = undefined
    setStatus('closed')
  }

  function createPeer(currentSessionId: string) {
    return new MatchPeer({
      onStatus: setStatus,
      onMessage: (message) => {
        void handleWireMessage(message, currentSessionId)
      },
    })
  }

  async function handleWireMessage(message: WireEnvelope, fallbackSessionId: string) {
    await runAction(async () => {
      if (message.type === 'hello') {
        setPeerHello(message)
        const prepared =
          preparedRef.current ?? (await prepareCurrentProfile(message.sessionId || fallbackSessionId))
        const request = buildProofRequest(prepared, message)
        requestedRef.current = request.requestedDigests
        peerRef.current?.send(request)
        return
      }

      if (message.type === 'proof-request') {
        const response = await worker.createProofResponse(
          profile,
          message.sessionId,
          message.requestedDigests,
        )
        peerRef.current?.send(response)
        return
      }

      await acceptProofResponse(message)
    })
  }

  async function acceptProofResponse(response: ProofResponseEnvelope) {
    const prepared = preparedRef.current
    if (!prepared) {
      throw new Error('Prepare a local session before accepting proofs')
    }
    const requested = requestedRef.current
    const result = await worker.verifyProofResponse(
      response,
      prepared.hello.sessionId,
      requested,
      prepared.records,
    )
    setMatches(result.matches)
    setInsight(await summarizeMatches(profile, result.matches))
  }

  async function runAction(action: () => Promise<void>) {
    setBusy(true)
    try {
      await action()
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unexpected matching error')
    } finally {
      setBusy(false)
    }
  }

  async function inferSessionAfterOffer() {
    return sessionId
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Proof exchange</h2>
            <p className="text-sm text-slate-600">
              Bloom filters find candidates; BBS packets prove only requested matches.
            </p>
          </div>
          <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700">{status}</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-3 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            type="button"
            disabled={busy}
            onClick={runLocalDemo}
          >
            <FlaskConical className="size-4" aria-hidden="true" />
            Run private demo
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-3 font-semibold hover:border-slate-500 disabled:opacity-60"
            type="button"
            disabled={busy}
            onClick={hostSession}
          >
            <RadioTower className="size-4" aria-hidden="true" />
            Host session
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-3 font-semibold hover:border-slate-500 disabled:opacity-60"
            type="button"
            disabled={busy || status !== 'open'}
            onClick={sendHello}
          >
            <Send className="size-4" aria-hidden="true" />
            Send proofs
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-3 font-semibold hover:border-red-400 hover:text-red-700 disabled:opacity-60"
            type="button"
            disabled={busy}
            onClick={disconnect}
          >
            <Unplug className="size-4" aria-hidden="true" />
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h3 className="font-semibold">Host</h3>
            {offer ? <SignalBox label="Offer" value={offer} /> : null}
            <label className="grid gap-1 text-sm font-semibold">
              Answer from peer
              <textarea
                className="min-h-24 rounded-md border border-slate-300 bg-white p-3 font-mono text-xs font-normal"
                value={answerInput}
                onChange={(event) => setAnswerInput(event.target.value)}
              />
            </label>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-3 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              type="button"
              disabled={busy || !answerInput.trim()}
              onClick={acceptAnswer}
            >
              <Cable className="size-4" aria-hidden="true" />
              Accept answer
            </button>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h3 className="font-semibold">Join</h3>
            <label className="grid gap-1 text-sm font-semibold">
              Offer from host
              <textarea
                className="min-h-24 rounded-md border border-slate-300 bg-white p-3 font-mono text-xs font-normal"
                value={offerInput}
                onChange={(event) => setOfferInput(event.target.value)}
              />
            </label>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-3 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              type="button"
              disabled={busy || !offerInput.trim()}
              onClick={joinSession}
            >
              <Cable className="size-4" aria-hidden="true" />
              Create answer
            </button>
            {answer ? <SignalBox label="Answer" value={answer} /> : null}
          </div>
        </div>

        {peerHello ? (
          <div className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
            Peer: {peerHello.sender.displayName} · {peerHello.attributeCount} private attributes committed
          </div>
        ) : null}
      </section>

      <MatchResults matches={matches} insight={insight} />
    </div>
  )
}
