import type { Plane } from "../planeUtils/plane.types"
import { broadcastData } from "./BroadcastPlains"
import { planeData } from "./PlaneData"
import type { BBox, Message } from "./types"
import { getPlanesInBBox } from "./VisiblePlanes"

export interface IPlaneWorkerManager {
    handleMessage(msg: Message): void
}
class PlaneWorkerManager implements IPlaneWorkerManager {

    #getVisiblePlanesInBBox(bbox: BBox): Plane[] {
        return getPlanesInBBox(bbox, planeData.getPlanesById())
    }

    handleMessage(msg: Message) {
        switch (msg.type) {
            case "SET_PLANES":
                planeData.setPlanes(msg.planes)
                broadcastData.broadcastAllData(planeData.getPlanesById(), "ALL_PLANES")
                break

            case "VISIBLE_PLANES_RECALCULATE":
                broadcastData.broadcastVisibleData(this.#getVisiblePlanesInBBox(msg.bbox), "VISIBLE_PLANES")
                break

            case "RENAME_PLANE":
                planeData.renamePlane(msg.id, msg.name)
                broadcastData.broadcastAllData(planeData.getPlanesById(), "ALL_PLANES")
                break
        }
    }
}
export const PlaneWorkerManagerClass = new PlaneWorkerManager()