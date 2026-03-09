import { useRef } from "react";
import { PlaneEditor } from "../PlaneEditor/PlaneEditor";
import { useRadarDeck } from "./useRadarDeck";
import { Box } from "@mui/material";

export function RadarMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useRadarDeck(mapContainerRef);

  return (
    <Box style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Box
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      />

      <Box
        style={{
          position: "absolute",
          top: 16,
          right: 100,
          zIndex: 10, 
        }}
      >
        <PlaneEditor />
      </Box>
    </Box>
  );
}

