import type { MapObject } from "../models/MapObject"
import type { BroadcastMessage } from "./types"

export interface IBroadcastData<T> {
    // postMessageToAllPorts(broadcastMessage: BroadcastMessage): void
    broadcastData(broadcastMessage: BroadcastMessage): void
}
class BroadcastData<T> implements IBroadcastData<T> {

    #ports: MessagePort[] = []
    addPort(port: MessagePort) {
        if (!this.#ports.includes(port)) {
            port.start()
            this.#ports.push(port)
        }
    }

    // postMessageToAllPorts(broadcastMessage: BroadcastMessage): void {
    //     for (const port of this.#ports) {
    //         port.postMessage(broadcastMessage)
    //     }
    // }

    broadcastData(broadcastMessage: BroadcastMessage): void {
        for (const port of this.#ports) {
            port.postMessage(broadcastMessage)
        }
    }

}

export const broadcastData = new BroadcastData<MapObject>()