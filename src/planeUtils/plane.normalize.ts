import type { Plane } from "./plane.types";

type RawPlane = any;

function toNum(v: any): number {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : NaN;
}

export function buildValidPlanesList(raw: RawPlane[]): Plane[] {
  if (!Array.isArray(raw)) return [];

  const planes: Plane[] = [];

  for (const rawPlane  of raw) {
    const id = String(rawPlane?.id ?? "").trim();
    if (!id) continue;

    const lat = toNum(rawPlane?.geoLocation?.lat);
    const lon = toNum(rawPlane?.geoLocation?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const name = String(rawPlane?.name ?? "Unknown").trim() || "Unknown";
    const country = String(rawPlane?.country ?? "Unknown").trim() || "Unknown";
    const heading = toNum(rawPlane?.heading) || 0;

    planes.push({
      id,
      name,
      country,
      geoLocation: { lat, lon },
      heading,
    });
  }

  return planes;
}
