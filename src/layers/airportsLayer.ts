// import { ScatterplotLayer } from "@deck.gl/layers";
// import { countryToRgb } from "../domain/plane.color";

// export function makeAirportsLayer({ data }) {
//   return new ScatterplotLayer({
//     id: "airports",
//     data,

//     pickable: false,

//     getPosition: (d) => [d.lon, d.lat],

//      getColor: (p) =>  countryToRgb(p.country),
   
//     getRadius: 5000, 

//     radiusUnits: "meters",

//     radiusMinPixels: 3,
//   });
// }