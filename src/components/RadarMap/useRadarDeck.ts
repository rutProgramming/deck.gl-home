import { useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import maplibregl, { Map } from "maplibre-gl";
import { planesStore } from "../../store/planes.store";
import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import plane from "../../assets/PM.png";
import { Deck } from "@deck.gl/core";
import { getVisiblePlanes } from "../../services/workerClient";

const INITIAL_VIEW_STATE = {
  longitude: 34.85,
  latitude: 31.95,
  zoom: 6,
  bearing: 0,
  pitch: 0,
};

export function useRadarDeck(mapContainerRef: RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<Map | null>(null);
  const deckRef = useRef<Deck | null>(null);
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

      const deck = new Deck({
        parent: mapContainerRef.current!,
        style: {
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "10",
          pointerEvents: "none",
        },
        initialViewState: INITIAL_VIEW_STATE,
        controller: false,
        layers: [],
      });

      deckRef.current = deck;

      const syncDeckCamera = () => {
        const c = map.getCenter();
        deck.setProps({
          viewState: {
            longitude: c.lng,
            latitude: c.lat,
            zoom: map.getZoom(),
            bearing: map.getBearing(),
            pitch: map.getPitch(),
          },
        });
      };

      map.on("move", syncDeckCamera);
      syncDeckCamera();

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

      disposeFlyToRef.current = reaction(
        () => planesStore.selectedPlane,
        (selected) => {
          if (!selected) return;

          const { lat, lon } = selected.geoLocation;
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
          deck.setProps({ layers: [layer] });
        },
        { fireImmediately: true }
      );
    });

    return () => {
      disposeLayerReactionRef.current?.();
      disposeLayerReactionRef.current = null;

      disposeFlyToRef.current?.();
      disposeFlyToRef.current = null;

      deckRef.current?.finalize();
      deckRef.current = null;

      map.remove();
      mapRef.current = null;
      resizeObserver.disconnect();
    };
  }, [mapContainerRef]);
}