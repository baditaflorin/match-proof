import { decodeJson, encodeJson } from '../matching/encoding'
import type { WireEnvelope } from '../matching/protocol'
import { fetchIceServers, STUN_SERVERS } from './turnConfig'

export type PeerStatus =
  | 'idle'
  | 'creating-offer'
  | 'waiting-for-answer'
  | 'creating-answer'
  | 'connecting'
  | 'open'
  | 'closed'
  | 'failed'

export type WireMessage = WireEnvelope

interface MatchPeerOptions {
  onStatus: (status: PeerStatus) => void
  onMessage: (message: WireMessage) => void
}

export class MatchPeer {
  private readonly pc: RTCPeerConnection
  private channel?: RTCDataChannel
  private readonly onStatus: (status: PeerStatus) => void
  private readonly onMessage: (message: WireMessage) => void

  constructor(options: MatchPeerOptions) {
    // Start STUN-only so the constructor stays synchronous, then upgrade
    // the ICE-server set to include HMAC TURN credentials as soon as the
    // token server responds. Future ICE candidate gathering picks up the
    // relay path — important for peers behind symmetric NAT.
    this.pc = new RTCPeerConnection({ iceServers: STUN_SERVERS })
    void fetchIceServers().then((iceServers) => {
      try { this.pc.setConfiguration({ iceServers }) } catch { /* peer closed */ }
    })
    this.onStatus = options.onStatus
    this.onMessage = options.onMessage
    this.pc.addEventListener('connectionstatechange', () => {
      if (this.pc.connectionState === 'connected') {
        this.onStatus('open')
      }
      if (['closed', 'failed', 'disconnected'].includes(this.pc.connectionState)) {
        this.onStatus(this.pc.connectionState === 'failed' ? 'failed' : 'closed')
      }
    })
    this.pc.addEventListener('datachannel', (event) => {
      this.attachChannel(event.channel)
    })
  }

  async createOffer(): Promise<string> {
    this.onStatus('creating-offer')
    this.attachChannel(this.pc.createDataChannel('match-proof'))
    await this.pc.setLocalDescription(await this.pc.createOffer())
    await waitForIceGathering(this.pc)
    this.onStatus('waiting-for-answer')
    return encodeJson(this.pc.localDescription?.toJSON())
  }

  async acceptOffer(encodedOffer: string): Promise<string> {
    this.onStatus('creating-answer')
    await this.pc.setRemoteDescription(decodeJson<RTCSessionDescriptionInit>(encodedOffer.trim()))
    await this.pc.setLocalDescription(await this.pc.createAnswer())
    await waitForIceGathering(this.pc)
    this.onStatus('connecting')
    return encodeJson(this.pc.localDescription?.toJSON())
  }

  async acceptAnswer(encodedAnswer: string): Promise<void> {
    this.onStatus('connecting')
    await this.pc.setRemoteDescription(decodeJson<RTCSessionDescriptionInit>(encodedAnswer.trim()))
  }

  send(message: WireMessage): void {
    if (!this.channel || this.channel.readyState !== 'open') {
      throw new Error('Peer channel is not open')
    }
    this.channel.send(JSON.stringify(message))
  }

  close(): void {
    this.channel?.close()
    this.pc.close()
    this.onStatus('closed')
  }

  private attachChannel(channel: RTCDataChannel): void {
    this.channel = channel
    this.channel.addEventListener('open', () => this.onStatus('open'))
    this.channel.addEventListener('close', () => this.onStatus('closed'))
    this.channel.addEventListener('message', (event: MessageEvent<string>) => {
      this.onMessage(JSON.parse(event.data) as WireMessage)
    })
  }
}

function waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === 'complete') {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const timeout = window.setTimeout(done, 1500)

    function done() {
      window.clearTimeout(timeout)
      pc.removeEventListener('icegatheringstatechange', onChange)
      resolve()
    }

    function onChange() {
      if (pc.iceGatheringState === 'complete') {
        done()
      }
    }

    pc.addEventListener('icegatheringstatechange', onChange)
  })
}
