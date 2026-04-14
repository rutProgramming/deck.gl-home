import type { Plane } from "../planeUtils/plane.types"

export interface IPlaneData {
    setPlanes(planes: Plane[]): void
    renamePlane(id: string, name: string): void
    getPlanesById(): Map<string, Plane>
}
class PlaneData implements IPlaneData {
    #planesById = new Map<string, Plane>()
   
    setPlanes(planes: Plane[]) {
        for (const p of planes) {
            this.#planesById.set(p.id, p)
        }
    }
    renamePlane(id: string, name: string) {
        const plane = this.#planesById.get(id)
        if (plane) {
            plane.name = name
        }
    }
    getPlanesById(): Map<string, Plane> {
        return new Map(this.#planesById)
    }

}
export const planeData = new PlaneData()