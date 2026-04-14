import type { Plane } from "../Plane/plane.types"

export interface IBroadcastPlains {
    postMessageToAllPorts(type: string, planes: Plane[]): void
    broadcastAllPlanes(planesById: Map<string, Plane>): void
    broadcastVisiblePlanes(visiblePlanes: Plane[]): void
}
export class BroadcastPlains implements IBroadcastPlains {

    #ports: MessagePort[] = []
    private static _instance: BroadcastPlains
    private constructor() { }

    static getInstance() {
        if (!BroadcastPlains._instance) {
            BroadcastPlains._instance = new BroadcastPlains()
        }
        return BroadcastPlains._instance
    }
    addPort(port: MessagePort) {
        if (!this.#ports.includes(port)) {
            port.start()
            this.#ports.push(port)
        }
    }


    postMessageToAllPorts(type: string, planes: Plane[]) {
        for (const port of this.#ports) {
            port.postMessage({ type, planes })
        }
    }
    broadcastAllPlanes(planesById: Map<string, Plane>) {
        const planes = Array.from(planesById.values())
        this.postMessageToAllPorts("ALL_PLANES", planes)
    }

    broadcastVisiblePlanes(visiblePlanes: Plane[]): void {
        this.postMessageToAllPorts("VISIBLE_PLANES", visiblePlanes)
    }

}