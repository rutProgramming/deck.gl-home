import { useCallback, useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import type { IMapRenderer } from "./IMapRenderer";
import { planesStore } from "../../store/planes.store";
import type { Plane } from "../../planeUtils/plane.types";
import { visiblePlanesRecalculate } from "../../services/workerClient";


export function useMap(
    mapContainerRef: RefObject<HTMLDivElement | null>,
    createMapRenderer: () => IMapRenderer<Plane>
) {
    const mapRendererRef = useRef<IMapRenderer<Plane> | null>(null);
    const flyToPlaneCallback = useCallback((lat: number, lon: number) => {
        const mapRenderer = mapRendererRef.current;
        if (!mapRenderer) return;
        mapRenderer.flyToLocation(lat, lon);
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        const mapRenderer = createMapRenderer();
        mapRenderer.attach(mapContainerRef.current);
        mapRendererRef.current = mapRenderer;

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
                mapRendererRef.current?.renderItems(planes, selectedId)
            },
            { fireImmediately: true }
        );

        return () => {
            mapRendererRef.current?.cleanUp();
            disposeLayerReactionRef();
            // resizeObserver.disconnect();
        };

    }, [mapContainerRef]);

    return flyToPlaneCallback;
}

