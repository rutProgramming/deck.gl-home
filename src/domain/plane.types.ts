export type GeoLocation = {
  lat: number;
  lon: number;
};

export type Plane = {
  id: string;
  name: string;
  country: string;
  geoLocation: GeoLocation;
};