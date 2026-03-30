import type { Plane } from "../domain/plane.types"
import type { IBroadcastPlains } from "./BroadcastPlains"
import type { IPlaneWorker } from "./PlaneWorker"
import type { IVisiblePlanes } from "./VisiblePlanes"
import type { BBox, Message } from "./worker.types"

export interface IPlaneWorkerManager {
    handleMessage(msg: Message): void
}
export class PlaneWorkerManager implements IPlaneWorkerManager {
    #visiblePlanes: IVisiblePlanes
    #broadcastPlains: IBroadcastPlains
    #planeWorker: IPlaneWorker

    private static _instance: PlaneWorkerManager

    private constructor(
        visiblePlanes: IVisiblePlanes,
        broadcastPlains: IBroadcastPlains,
        planeWorker: IPlaneWorker
    ) {
        this.#visiblePlanes = visiblePlanes
        this.#broadcastPlains = broadcastPlains
        this.#planeWorker = planeWorker
    }

    static init(
        visiblePlanes: IVisiblePlanes,
        broadcastPlains: IBroadcastPlains,
        planeWorker: IPlaneWorker
    ) {
        if (!PlaneWorkerManager._instance) {
            PlaneWorkerManager._instance = new PlaneWorkerManager(
                visiblePlanes,
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


    #getVisiblePlanesInViewport(bbox: BBox): Plane[] {
        return this.#visiblePlanes.getPlanesInViewport(bbox, this.#planeWorker.getPlanesById())
    }

    handleMessage(msg: Message) {

        switch (msg.type) {
            case "INGEST_PLANES":

                this.#planeWorker.ingestPlanes(msg.planes)
                this.#broadcastPlains.broadcastAllPlanes(this.#planeWorker.getPlanesById())
                break

            case "GET_VISIBLE_PLANES":
                this.#broadcastPlains.broadcastVisiblePlanes(this.#getVisiblePlanesInViewport(msg.bbox))
                break

            case "RENAME_PLANE":
                this.#planeWorker.renamePlane(msg.id, msg.name)
                this.#broadcastPlains.broadcastAllPlanes(this.#planeWorker.getPlanesById())
                break
        }
    }
}