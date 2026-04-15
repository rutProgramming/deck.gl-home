/// <reference lib="webworker" />
import { broadcastData } from "./BroadcastData.ts"
import { handleMessage } from "./utils/workerMessageHandler.ts.ts"
import type { Message } from "./types.ts"

export { }

declare const self: SharedWorkerGlobalScope


self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0]
  broadcastData.addPort(port)
  port.onmessage = (e: MessageEvent<Message>) => handleMessage(e.data)
}