// import type { Plane } from "../../domain/plane.types";

// export const flyToPlane = (plane: Plane | null) => {
//             if (!plane) return;
//             const { lat, lon } = plane.geoLocation;
//             const bounds = map.getBounds();
//             const visible = lon >= bounds.getWest() && lon <= bounds.getEast()
//                 && lat >= bounds.getSouth() && lat <= bounds.getNorth();
//             if (!visible) map.flyTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 8), duration: 800 });
//         };