import type { Plane } from "../planeUtils/plane.types"

export interface IPlaneWorker {
    setPlanes(planes: Plane[]): void
    renamePlane(id: string, name: string): void
    getPlanesById(): Map<string, Plane>
}
export class PlaneWorker implements IPlaneWorker {
    #planesById = new Map<string, Plane>()
    private static _instance: PlaneWorker
    private constructor() { }

    static getInstance() {
        if (!PlaneWorker._instance) PlaneWorker._instance = new PlaneWorker()
        return PlaneWorker._instance
    }
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