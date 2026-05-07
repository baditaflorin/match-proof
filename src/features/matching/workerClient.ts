import * as Comlink from 'comlink'
import type { CryptoWorkerApi } from './cryptoWorker'

let workerApi: Comlink.Remote<CryptoWorkerApi> | undefined

export function getCryptoWorker(): Comlink.Remote<CryptoWorkerApi> {
  if (!workerApi) {
    const worker = new Worker(new URL('./cryptoWorker.ts', import.meta.url), { type: 'module' })
    workerApi = Comlink.wrap<CryptoWorkerApi>(worker)
  }
  return workerApi
}
