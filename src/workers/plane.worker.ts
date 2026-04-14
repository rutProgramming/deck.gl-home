/// <reference lib="webworker" />
import { BroadcastPlains } from "./BroadcastPlains"
import { PlaneWorker } from "./PlaneWorker"
import { PlaneWorkerManager } from "./PlaneWorkerManager"
import type { Message } from "./worker.types"

export { }

declare const self: SharedWorkerGlobalScope

const broadcastPlains = BroadcastPlains.getInstance()
const planeWorker = PlaneWorker.getInstance()
const planeWorkerManager = PlaneWorkerManager.init(broadcastPlains, planeWorker)

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0]
  broadcastPlains.addPort(port)
  port.onmessage = (e: MessageEvent<Message>) => planeWorkerManager.handleMessage(e.data)
}