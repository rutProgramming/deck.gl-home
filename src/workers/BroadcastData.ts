import type { MapObject } from "../models/MapObject"

export interface IBroadcastData<T> {
    postMessageToAllPorts(type: string, data: T[]): void
    broadcastData(data: T[], message: string): void
}
class BroadcastData<T> implements IBroadcastData<T> {

    #ports: MessagePort[] = []
    addPort(port: MessagePort) {
        if (!this.#ports.includes(port)) {
            port.start()
            this.#ports.push(port)
        }
    }

    postMessageToAllPorts(type: string, data: Partial<T>[]) {
        for (const port of this.#ports) {
            port.postMessage({ type, data })
        }
    }

    broadcastData(data: Partial<T>[], message: string): void {
        this.postMessageToAllPorts(message, data)
    }

}

export const broadcastData = new BroadcastData<MapObject>()