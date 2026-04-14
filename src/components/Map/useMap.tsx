import { useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import  { Map } from "maplibre-gl";
import type { IMapDrawer } from "./IMapDrawer";
import type { IMapOptions } from "./IMapOptions";
import { requestVisiblePlanes } from "../../services/workerClient";
import { planesStore } from "../../store/planes.store";
import type { Plane } from "../../domain/plane.types";



export function useMap(
    mapContainerRef: RefObject<HTMLDivElement | null>,
    options: IMapOptions
) {
    const mapRef = useRef<Map | null>(null);
    const layerRef = useRef<IMapDrawer<Plane> | null>(null);
    const flyToPlane = useRef<(lat: number, lon: number) => void|null>(null);


    useEffect(() => {
        if (!mapContainerRef.current) return;
        const { createLayer } = options;
        const layer = createLayer();
        layer.attach(mapContainerRef.current!);
        layerRef.current = layer;
        const map = layerRef.current?.getMapInstance()
        if (!map) return
        mapRef.current = map;
        flyToPlane.current = layer.flyToPlane;
        const resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(mapContainerRef.current!);
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

        // const disposeFlyToRef = reaction(() => planesStore.selectedPlane, flyToPlane);
        const disposeLayerReactionRef = reaction(
            () => ({ planes: planesStore.visiblePlanes, selectedId: planesStore.selectedPlaneId }),
            ({ planes, selectedId }) => {
                layerRef.current?.renderItems(planes, selectedId)
            },
            { fireImmediately: true }
        );

        return () => {
            layerRef.current?.cleanUp();
            disposeLayerReactionRef();
            mapRef.current = null;
            resizeObserver.disconnect();
        };
    }, [mapContainerRef]);

return flyToPlane;}

