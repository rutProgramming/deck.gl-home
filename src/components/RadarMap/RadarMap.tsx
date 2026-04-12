import { useRef } from "react";
import { Box } from "@mui/material";
import { PlaneEditor } from "../PlaneEditor/PlaneEditor";
import { PlanesPanel } from "../PlanesPanel/PlanesPanel";
import { useRadarMap } from "./useRadarMap";
import { planesStore } from "../../store/planes.store";
import { getVisiblePlanes } from "../../services/workerClient";
import { RadarDeck } from "./RadarDeck";
import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import plane from "../../assets/PM.png";

const INITIAL_VIEW_STATE = {
    longitude: 34.85, 
    latitude: 31.95,
    zoom: 6,
    bearing: 0, 
    pitch: 0,
};

export function RadarMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useRadarMap(mapContainerRef, {
        initialViewState: INITIAL_VIEW_STATE,
        createLayer: () => new RadarDeck(
            (id) => planesStore.selectPlane(id),
            ({ data, selectedId, onPickPlane }) =>
                makePlanesIconLayer({ data, selectedId, iconAtlas: plane, onPickPlane })
        ),
        getVisiblePlanes,
        store: planesStore,
    });

    return (
        <Box style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <Box ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
            <Box style={{ position: "absolute", top: 16, right: 100, zIndex: 10 }}>
                <PlaneEditor />
            </Box>
            <Box style={{ position: "absolute", bottom: 16, left: 100, zIndex: 10 }}>
                <PlanesPanel />
            </Box>
        </Box>
    );
}