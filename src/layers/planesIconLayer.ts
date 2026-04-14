import { IconLayer } from "@deck.gl/layers";
import type { Plane } from "../planeUtils/plane.types";
import { countryToRgb } from "../planeUtils/plane.color";

export type PlanesIconLayer = {
  id?: string;
  data: Plane[];
  selectedId: string | null;
  iconAtlas: string;
  onPickPlane: (id: string) => void;
};

const SELECTED_PLANE_ALPHA = 255;
const DEFAULT_PLANE_ALPHA = 220;
const SELECTED_PLANE_SIZE = 38;
const UNSELECTED_PLANE_SIZE = 28;
const ROTATION_CORRECTION_PLANE=45
const ICON_SIZE = 64;
const ICON_ANCHOR = 32;

export function makePlanesIconLayer(args: PlanesIconLayer) {
  
  const { data, selectedId, iconAtlas, onPickPlane } = args;
  
  return new IconLayer<Plane>({
    id: args.id ?? "planes-icon-layer",
    data,
    pickable: true,
    sizeScale: 1,

    getIcon: () => ({
      url: iconAtlas,
      width: ICON_SIZE,
      height: ICON_SIZE,
      anchorX: ICON_ANCHOR,
      anchorY: ICON_ANCHOR,
      mask: true,
    }),

    getPosition: (p) => [p.geoLocation.lon, p.geoLocation.lat],
    getSize: (p) => (p.id === selectedId ? SELECTED_PLANE_SIZE : UNSELECTED_PLANE_SIZE),
    updateTriggers: {
      getSize: [selectedId],
    },
    getColor: (p) => {
      const [r, g, b] = countryToRgb(p.country);

      return p.id === selectedId
        ? [r, g, b, SELECTED_PLANE_ALPHA]
        : [r, g, b, DEFAULT_PLANE_ALPHA];
    },

    getAngle: (p) => ROTATION_CORRECTION_PLANE - (p.heading ?? 0),
    onClick: (info) => {
      const p = info.object;
      if (p?.id) onPickPlane(p.id);
    },
  });
}