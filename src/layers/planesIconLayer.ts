import { IconLayer } from "@deck.gl/layers";
import type { Plane } from "../domain/plane.types";
import { countryToRgb } from "../domain/plane.color";

type Args = {
  id?: string;
  data: Plane[];
  selectedId: string | null;
  iconAtlas: string;
  onPickPlane: (id: string) => void;
};

export function makePlanesIconLayer(args: Args) {
  const { data, selectedId, iconAtlas, onPickPlane } = args;

  return new IconLayer<Plane>({
    id: args.id ?? "planes-icon-layer",
    data,
    pickable: true,
    sizeScale: 1,

    getIcon: () => ({
      url: iconAtlas,
      width: 64,
      height: 64,
      anchorY: 32,
      mask: true,
    }),
    getPosition: (p) => [p.geoLocation.lon, p.geoLocation.lat],
    getSize: (p) => (p.id === selectedId ? 38 : 28),
    getColor: (p) => {
      const [r, g, b] = countryToRgb(p.country);
      return p.id === selectedId ? [r, g, b, 255] : [r, g, b, 220];
    },

    onClick: (info) => {
      const p = info.object;
      if (p?.id) onPickPlane(p.id);
    },
  });
}