/// <reference lib="webworker" />
import { BroadcastPlains } from "./BroadcastPlains"
import { PlaneWorker } from "./PlaneWorker"
import { PlaneWorkerManager } from "./PlaneWorkerManager"
import { VisiblePlanes } from "./VisiblePlanes"
import type { Message } from "./worker.types"

export { }

declare const self: SharedWorkerGlobalScope

const visiblePlanes = VisiblePlanes.getInstance()
const broadcastPlains = BroadcastPlains.getInstance()
const planeWorker = PlaneWorker.getInstance()
const planeWorkerManager = PlaneWorkerManager.getInstance(visiblePlanes, broadcastPlains, planeWorker)

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0]
  broadcastPlains.addPort(port)
  // port.start()
  port.onmessage = (e: MessageEvent<Message>) => planeWorkerManager.handleMessage(e.data)
}