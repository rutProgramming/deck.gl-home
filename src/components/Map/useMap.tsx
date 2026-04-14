import { useCallback, useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import type { IMapRenderer } from "./IMapRenderer";
import { requestVisiblePlanes } from "../../services/workerClient";
import { planesStore } from "../../store/planes.store";
import type { Plane } from "../../Plane/plane.types";


export function useMap(
    mapContainerRef: RefObject<HTMLDivElement | null>,
    createMapRenderer: () => IMapRenderer<Plane>
) {
    const mapRendererRef = useRef<IMapRenderer<Plane> | null>(null);
    const flyToPlaneCallback = useCallback((lat: number, lon: number) => {
        const drawer = mapRendererRef.current;
        if (!drawer) return;
        drawer.flyToLocation(lat, lon);
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        const mapDrawer = createMapRenderer();
        mapDrawer.attach(mapContainerRef.current);
        mapRendererRef.current = mapDrawer;
        const map = mapRendererRef.current?.getMapInstance()
        if (!map) return
        const resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(mapContainerRef.current);
        const requestVisiblePlanesFromWorker = () => {
            const bounds = map.getBounds();
            requestVisiblePlanes({
                west: bounds.getWest(),
                east: bounds.getEast(),
                north: bounds.getNorth(),
                south: bounds.getSouth(),
            });
        };
        requestVisiblePlanesFromWorker();

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
            resizeObserver.disconnect();
        };

    }, [mapContainerRef]);

    return flyToPlaneCallback;
}

