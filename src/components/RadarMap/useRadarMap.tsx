import { useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import maplibregl, { Map } from "maplibre-gl";
import type { Plane } from "../../domain/plane.types";
import type { IRadarLayer } from "./IRadarLayer";
import type { IRadarMapOptions } from "./IRadarMapOptions";



export function useRadarMap(
    mapContainerRef: RefObject<HTMLDivElement | null>,
    options: IRadarMapOptions
) {
    const mapRef = useRef<Map | null>(null);
    const layerRef = useRef<IRadarLayer | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const { initialViewState, createLayer, getVisiblePlanes, store} = options;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_REACT_KEY}`,
            center: [initialViewState.longitude, initialViewState.latitude],
            zoom: initialViewState.zoom,
            pitch: 0,
            maxPitch: 0,
        });

        mapRef.current = map;

        const resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(mapContainerRef.current!);

        const syncCamera = () => {
            const c = map.getCenter();
            layerRef.current?.setViewState({
                longitude: c.lng,
                latitude: c.lat,
                zoom: map.getZoom(),
                bearing: map.getBearing(),
                pitch: map.getPitch(),
            });
        };

        const sendViewportQuery = () => {
            const b = map.getBounds();
            getVisiblePlanes({
                west: b.getWest(), 
                east: b.getEast(),
                north: b.getNorth(), 
                south: b.getSouth(),
            });
        };

        const flyToPlane = (plane: Plane | null) => {
            if (!plane) return;
            const { lat, lon } = plane.geoLocation;
            const b = map.getBounds();
            const visible = lon >= b.getWest() && lon <= b.getEast()
                && lat >= b.getSouth() && lat <= b.getNorth();
            if (!visible) map.flyTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 8), duration: 800 });
        };

        map.on("load", () => {
            const layer = createLayer();
            layer.attach(mapContainerRef.current!);
            layerRef.current = layer;

            map.on("move", syncCamera);
            syncCamera();
            sendViewportQuery();
            map.on("moveend", sendViewportQuery);

            const disposeFlyToRef = reaction(() => store.selectedPlane, flyToPlane);
            const disposeLayerReactionRef = reaction(
                () => ({ planes: store.visiblePlanes, selectedId: store.selectedPlaneId }),
                ({ planes, selectedId }) => {                    
                    layerRef.current?.renderPlanes(planes, selectedId)
                },
                { fireImmediately: true }
            );

            map.once("remove", () => {
                disposeFlyToRef();
                disposeLayerReactionRef();
            });
        });

        return () => {
            layerRef.current?.finalize();
            map.remove();
            mapRef.current = null;
            resizeObserver.disconnect();
        };
    }, [mapContainerRef]);
}