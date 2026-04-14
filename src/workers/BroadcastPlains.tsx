import type { Plane } from "../planeUtils/plane.types"

export interface IBroadcastData<T> {
    postMessageToAllPorts(type: string, data: T[]): void
    broadcastAllData(dataById: Map<string, T>, massage:string): void
    broadcastVisibleData(visibledata: T[], massage:string): void
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
    broadcastAllData(dataById: Map<string, T>, massage:string): void {
        const data = Array.from(dataById.values())
        this.postMessageToAllPorts(massage, data)
    }

    broadcastVisibleData(visibleData: T[], massage:string): void {
        this.postMessageToAllPorts(massage, visibleData)
    }

}

export const broadcastData = new BroadcastData<Plane>()