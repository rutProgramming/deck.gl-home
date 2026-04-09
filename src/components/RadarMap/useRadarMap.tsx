import { useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import maplibregl, { Map } from "maplibre-gl";
import { planesStore } from "../../store/planes.store";
import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import plane from "../../assets/PM.png";
import { getVisiblePlanes } from "../../services/workerClient";
import type { Plane } from "../../domain/plane.types";
import type { IRadarMap } from "./IRadarMap";
import { RadarDeck } from "./RadarDeck";
import type { ViewState } from "./RadarMap.type";


const INITIAL_VIEW_STATE: ViewState = {
    longitude: 34.85,
    latitude: 31.95,
    zoom: 6,
    bearing: 0,
    pitch: 0,
};


export function useRadarMap(mapContainerRef: RefObject<HTMLDivElement | null>) {
    const mapRef = useRef<Map | null>(null);
    const LayerRef = useRef<IRadarMap>(null);

    const disposeLayerReactionRef = useRef<null | (() => void)>(null);
    const disposeFlyToRef = useRef<null | (() => void)>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_REACT_KEY}`,
            center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
            zoom: INITIAL_VIEW_STATE.zoom,
            pitch: 0,
            maxPitch: 0,
        });

        mapRef.current = map;

        const resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(mapContainerRef.current);

        map.on("load", () => {
            LayerRef.current = new RadarDeck(mapContainerRef, INITIAL_VIEW_STATE)
            const syncCamera = () => {
                const c = map.getCenter();
                LayerRef.current?.setLayerProps('viewState', {
                    viewState: {
                        longitude: c.lng,
                        latitude: c.lat,
                        zoom: map.getZoom(),
                        bearing: map.getBearing(),
                        pitch: map.getPitch(),
                    },

                });
            };
            map.on("move", syncCamera);
            syncCamera();

            const sendViewportQuery = () => {
                const b = map.getBounds();
                getVisiblePlanes({
                    west: b.getWest(),
                    east: b.getEast(),
                    north: b.getNorth(),
                    south: b.getSouth(),
                });
            };

            sendViewportQuery();
            map.on("moveend", sendViewportQuery);

            const flyMap = (selectedPlane: Plane | null) => {
                if (!selectedPlane) return;

                const { lat, lon } = selectedPlane.geoLocation;
                const b = map.getBounds();

                const alreadyVisible =
                    lon >= b.getWest() &&
                    lon <= b.getEast() &&
                    lat >= b.getSouth() &&
                    lat <= b.getNorth();

                if (alreadyVisible) return;

                map.flyTo({
                    center: [lon, lat],
                    zoom: Math.max(map.getZoom(), 8),
                    duration: 800,
                });
            }

            disposeFlyToRef.current = reaction(
                () => planesStore.selectedPlane,
                (selectedPlane) => {
                    flyMap(selectedPlane)
                }
            );

            disposeLayerReactionRef.current = reaction(
                () => ({
                    planes: planesStore.visiblePlanes,
                    selectedId: planesStore.selectedPlaneId,
                }),
                ({ planes, selectedId }) => {
                    const layer = makePlanesIconLayer({
                        data: planes,
                        selectedId,
                        iconAtlas: plane,
                        onPickPlane: (id) => planesStore.selectPlane(id),
                    });
                    LayerRef.current?.setLayerProps('layers', { layers: [layer] });
                },
                { fireImmediately: true }
            );
        });

        const destroy = () => {
            disposeLayerReactionRef.current?.();
            disposeLayerReactionRef.current = null;

            disposeFlyToRef.current?.();
            disposeFlyToRef.current = null;

            LayerRef.current?.finalize();
            map.remove();
            mapRef.current = null;
            resizeObserver.disconnect();
        }

        return () => {
            destroy()
        };
    }, [mapContainerRef]);
}