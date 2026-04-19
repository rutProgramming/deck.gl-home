export type GeoLocation = {
  lat: number;
  lon: number;
};

export interface MapObject {
  id: string
  name: string
  country: string
  geoLocation: GeoLocation
}