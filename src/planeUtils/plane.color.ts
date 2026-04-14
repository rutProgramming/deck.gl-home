export function countryToRgb(country: string): [number, number, number] {
  const c = (country || "").trim().toLowerCase();

  if (c === "israel") return [0, 122, 255]; 
  if (c === "syria" || c === "iran" || c === "lebanon") return [255, 59, 48]; 
  return [255, 149, 0]; 
}