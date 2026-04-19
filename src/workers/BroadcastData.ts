import type { MapObject } from "../models/MapObject"
import type { Target } from "./types"

export interface IBroadcastData<T> {
    postMessageToAllPorts(target: Target, meesage: string, data: T[]): void
    broadcastData(target: Target, data: T[], message: string): void
}
class BroadcastData<T> implements IBroadcastData<T> {

    #ports: MessagePort[] = []
    addPort(port: MessagePort) {
        if (!this.#ports.includes(port)) {
            port.start()
            this.#ports.push(port)
        }
    }

    postMessageToAllPorts(target: Target, message: string, data: Partial<T>[]) {
        for (const port of this.#ports) {
            port.postMessage({ target,message, data })
        }
    }

    broadcastData(target: Target, data: Partial<T>[], message: string): void {
        this.postMessageToAllPorts(target, message, data)
    }

}

export const broadcastData = new BroadcastData<MapObject>()