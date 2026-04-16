import type { MapObject } from "../models/MapObject"

export interface IBroadcastData<T> {
    postMessageToAllPorts(type: string, data: T[]): void
    broadcastData(visibleData: T[], massage:string): void
}
class BroadcastData<T> implements IBroadcastData<T> {

    #ports: MessagePort[] = []
    addPort(port: MessagePort) {
        if (!this.#ports.includes(port)) {
            port.start()
            this.#ports.push(port)
        }
    }


    postMessageToAllPorts(type: string, data: T[]) {
        for (const port of this.#ports) {
            port.postMessage({ type, data })
        }
    }

    broadcastData(visibleData: T[], massage:string): void {
        this.postMessageToAllPorts(massage, visibleData)
    }

}

export const broadcastData = new BroadcastData<MapObject>()