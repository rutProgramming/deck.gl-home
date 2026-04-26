import { mapStore } from "../../store/mapstore";
import { makeCarLayer, makePlaneLayer } from "./layerFactories";

 export function buildLayers() {
        return [
            makeCarLayer(mapStore.carStore.visibleMapObjects),

            makePlaneLayer(
                mapStore.planeStore.visibleMapObjects,
                mapStore.planeStore.selectedId,
                (id) => mapStore.planeStore.selectPlane(id)
            ),
        ];
    }