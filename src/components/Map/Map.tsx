import { useRef } from "react";
import { Box } from "@mui/material";
import { PlaneEditor } from "../PlaneEditor/PlaneEditor";
import { PlanesPanel } from "../PlanesPanel/PlanesPanel";
import { useMap } from "./useMap";
import { planesStore } from "../../store/planes.store";
import { DeckGlMapRenderer } from "./DeckGlMapRenderer";
import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import plane from "../../assets/PM.png";
import type { Plane } from "../../Plane/plane.types";

 

export function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const flyToPlaneCallback = useMap(mapContainerRef, 
        () => new DeckGlMapRenderer<Plane>(
            (id) => planesStore.selectPlane(id),
            ({ data, selectedId, onPickItem }) => makePlanesIconLayer({ data, selectedId, iconAtlas: plane,onPickPlane: onPickItem })
        )
    );

    return (
        <Box style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <Box ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
            <Box style={{ position: "absolute", top: 16, right: 100, zIndex: 10 }}>
                <PlaneEditor />
            </Box>
            <Box style={{ position: "absolute", bottom: 16, left: 100, zIndex: 10 }}>
                <PlanesPanel flyToPlane={(lat, lon) => flyToPlaneCallback(lat, lon)} />
            </Box>
        </Box>
    );
}