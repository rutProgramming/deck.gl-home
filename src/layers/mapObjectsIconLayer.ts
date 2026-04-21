import { IconLayer } from "@deck.gl/layers";
import type { MapObject } from "../models/MapObject";

export type PropsIconLayer<T extends MapObject> = {
  id?: string;
  data: T[];
  selectedId?: string | null;
  iconAtlas: string;
  onPick?: (id: string) => void;
  getAngle?: (item: T) => number;
  getColor?: (item: T) => [number, number, number];
};

const SELECTED_MAP_OBJECT_ALPHA = 255;
const DEFAULT_MAP_OBJECT_ALPHA = 220;
const SELECTED_MAP_OBJECT_SIZE = 38;
const UNSELECTED_MAP_OBJECT_SIZE = 28;
const ICON_SIZE = 64;
const ICON_ANCHOR = 32;

function toRgbalpha(
  r: number,
  g: number,
  b: number,
  alpha: number
): [number, number, number, number] {
  return [r, g, b, alpha]
}
export function makeMapObjectIconLayer<T extends MapObject>(args: PropsIconLayer<T>) {

  const { data, selectedId, iconAtlas, onPick, getAngle, getColor } = args;  
  console.log(args);
  
  return new IconLayer<T>({
    id: args.id ?? "icon-layer",
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

    getPosition: (mapObject) => [mapObject.geoLocation.lon, mapObject.geoLocation.lat],
    getSize: (mapObject) =>
      selectedId && mapObject.id === selectedId
        ? SELECTED_MAP_OBJECT_SIZE
        : UNSELECTED_MAP_OBJECT_SIZE,

    getColor: (mapObject) => {
      const rgb = getColor?.(mapObject) ?? [0, 0, 0]
      const alpha = mapObject.id === selectedId
        ? SELECTED_MAP_OBJECT_ALPHA
        : DEFAULT_MAP_OBJECT_ALPHA

      return toRgbalpha(...rgb, alpha)
    },
    updateTriggers: {
      getSize: [selectedId],
      getColor: [selectedId],
    },
    getAngle: (mapObject) => getAngle ? getAngle(mapObject) : 0,
    onClick: (info) => {
      const mapObject = info.object;
      if (mapObject?.id) onPick?.(mapObject.id);
    },
  });
}