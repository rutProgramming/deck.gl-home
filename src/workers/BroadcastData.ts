import type { BroadcastMessage } from "./types"

export interface IBroadcastData<T> {
    // postMessageToAllPorts(broadcastMessage: BroadcastMessage): void
    broadcastData(broadcastMessage: T): void
}
class BroadcastData<T> implements IBroadcastData<T> {

    #ports: MessagePort[] = []
    addPort(port: MessagePort) {
        if (!this.#ports.includes(port)) {
            port.start()
            this.#ports.push(port)
        }
    }
    broadcastData(broadcastMessage: T): void {
        for (const port of this.#ports) {
            port.postMessage(broadcastMessage)
        }
    }

}

export const broadcastData = new BroadcastData<BroadcastMessage>()