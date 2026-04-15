import { broadcastData } from "../BroadcastData"
import { planeData } from "../PlaneData"
import type { Message } from "../types"
import { getPlanesInBBox } from "./geoFilter"


const getAllPlanes = () => {
    return Array.from(planeData.getPlanesById().values())
}
export const handleMessage = (msg: Message) => {
    switch (msg.type) {
        case "SET_PLANES":
            planeData.setPlanes(msg.planes)
            broadcastData.broadcastData(getAllPlanes(), "ALL_PLANES")
            break

        case "VISIBLE_PLANES_RECALCULATE":
            broadcastData.broadcastData(getPlanesInBBox(msg.bbox, planeData.getPlanesById()), "VISIBLE_PLANES")
            break

        case "RENAME_PLANE":
            planeData.renamePlane(msg.id, msg.name)
            broadcastData.broadcastData(getAllPlanes(), "ALL_PLANES")
            break
    }
}
