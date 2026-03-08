

import { useRef } from "react";
import { PlaneEditor } from "../PlaneEditor/PlaneEditor";
import { useRadarDeck } from "./useRadarDeck";
import { PlanesPanel } from "../PlanesPanel/PlanesPanel";

// export function RadarMap() {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   useRadarDeck(mapContainerRef);
//   return (
//     <div style={{width: '100vw',height: '100vh'}}>
//       <div ref={mapContainerRef} style={{ width: '100vw',height: '100vh'}} />
//     </div>
//   );
// }





export function RadarMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useRadarDeck(mapContainerRef);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
      />

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 100,
          zIndex: 10, 
        }}
      >
        <PlaneEditor />
      </div>


       <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 100,
          zIndex: 10, 
        }}
      >
        <PlanesPanel />
      </div>
    </div>
  );
}

