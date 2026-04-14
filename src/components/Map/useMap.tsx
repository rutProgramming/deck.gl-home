import { useContext, useEffect, type RefObject } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { planesStore } from "../../store/planes.store";
import { visiblePlanesRecalculate } from "../../services/workerClient";


export function useMap(
    mapContainerRef: RefObject<HTMLDivElement | null>,
) {
    const mapRenderer = useContext(MapRendererContext);
    useEffect(() => {
        if (!mapContainerRef.current|| !mapRenderer) {
            return;
        };
        mapRenderer.attach(mapContainerRef.current);
        const updateMapBounds = () => {
            const bounds = mapRenderer.getBounds();
            if(!bounds) return;
            visiblePlanesRecalculate({
                west: bounds.getWest(),
                east: bounds.getEast(),
                north: bounds.getNorth(),
                south: bounds.getSouth(),
            });
        };
        updateMapBounds();

        const disposeLayerReactionRef = reaction(
            () => ({ planes: planesStore.visiblePlanes, selectedId: planesStore.selectedPlaneId }),
            ({ planes, selectedId }) => {
                mapRenderer.renderItems(planes.length > 0 ? planes : [], selectedId)
            },
            { fireImmediately: true }
        );

        return () => {
            mapRenderer.cleanUp();
            disposeLayerReactionRef();
        };

    }, [mapContainerRef, mapRenderer]);

}

