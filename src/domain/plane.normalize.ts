import type { Plane } from "./plane.types";

type RawPlane = any;

function toNum(v: any): number {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : NaN;
}

export function normalizePlanes(raw: RawPlane[]): Plane[] {
  if (!Array.isArray(raw)) return [];

  const out: Plane[] = [];

  for (const r of raw) {
    const id = String(r?.id ?? "").trim();
    if (!id) continue;

    const lat = toNum(r?.geoLocation?.lat);
    const lon = toNum(r?.geoLocation?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const name = String(r?.name ?? "Unknown").trim() || "Unknown";
    const country = String(r?.country ?? "Unknown").trim() || "Unknown";
    const heading = toNum(r?.heading) || 0;

    out.push({
      id,
      name,
      country,
      geoLocation: { lat, lon },
      heading,
    });
  }

  return out;
}