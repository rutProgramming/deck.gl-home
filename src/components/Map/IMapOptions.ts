import type { Plane } from "../../domain/plane.types";
import type { IMapDrawer } from "./IMapDrawer";

export interface IMapOptions {
    createLayer: () => IMapDrawer<Plane>;
}