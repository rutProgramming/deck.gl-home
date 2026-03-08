import React from "react";
import ReactDOM from "react-dom/client";
import raw from "./data/sample_planes_with_heading.json";
import countries from "./data/countries.json";
import { normalizePlanes } from "./domain/plane.normalize";
import { planesStore } from "./store/planes.store";
import { App } from "./App";
import { countryStore } from "./store/country.store";

planesStore.loadPlanes(normalizePlanes(raw));
countryStore.loadCountries(countries);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);