/// <reference lib="webworker" />
import { broadcastData } from "./BroadcastPlains"
import { PlaneWorkerManagerClass } from "./PlaneWorkerManager"
import type { Message } from "./types"

export { }

declare const self: SharedWorkerGlobalScope


self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0]
  broadcastData.addPort(port)
  port.onmessage = (e: MessageEvent<Message>) => PlaneWorkerManagerClass.handleMessage(e.data)
}