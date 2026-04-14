import type { Plane } from "../planeUtils/plane.types"
import type { IBroadcastPlains } from "./BroadcastPlains"
import type { IPlaneWorker } from "./PlaneWorker"
import { getPlanesInBBox } from "./VisiblePlanes"
import type { BBox, Message } from "./worker.types"

export interface IPlaneWorkerManager {
    handleMessage(msg: Message): void
}
export class PlaneWorkerManager implements IPlaneWorkerManager {
    #broadcastPlains: IBroadcastPlains
    #planeWorker: IPlaneWorker

    private static _instance: PlaneWorkerManager

    private constructor(
        broadcastPlains: IBroadcastPlains,
        planeWorker: IPlaneWorker
    ) {
        this.#broadcastPlains = broadcastPlains
        this.#planeWorker = planeWorker
    }

    static init(
        broadcastPlains: IBroadcastPlains,
        planeWorker: IPlaneWorker
    ) {
        if (!PlaneWorkerManager._instance) {
            PlaneWorkerManager._instance = new PlaneWorkerManager(
                broadcastPlains,
                planeWorker
            )
        }
        return PlaneWorkerManager._instance
    }

    static getInstance() {
        if (!PlaneWorkerManager._instance) {
            throw new Error("PlaneWorkerManager.init() must be called first")
        }
        return PlaneWorkerManager._instance
    }


    #getVisiblePlanesInBBox(bbox: BBox): Plane[] {
        return getPlanesInBBox(bbox, this.#planeWorker.getPlanesById())
    }

    handleMessage(msg: Message) {
        switch (msg.type) {
            case "SET_PLANES":

                this.#planeWorker.setPlanes(msg.planes)
                this.#broadcastPlains.broadcastAllPlanes(this.#planeWorker.getPlanesById())
                break

            case "VISIBLE_PLANES_RECALCULATE":
                this.#broadcastPlains.broadcastVisiblePlanes(this.#getVisiblePlanesInBBox(msg.bbox))
                break

            case "RENAME_PLANE":
                this.#planeWorker.renamePlane(msg.id, msg.name)
                this.#broadcastPlains.broadcastAllPlanes(this.#planeWorker.getPlanesById())
                break
        }
    }
}